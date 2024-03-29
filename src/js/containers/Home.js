import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import CategorySearchInput from '../components/CategorySearchInput';
import HelplineIcon from '../components/HelplineIcon';
import AccordionToggleIcon from '../components/AccordionToggleIcon';
import GoogleMaps from '../components/GoogleMaps';
import Share from '../components/Share';
import CategoryCards from '../components/CategoryCards';
import StatusCard from '../components/StatusCard';
import Footer from '../components/Footer';

import {
  getActivityData, getDataFromLatLang, getZoneColor, getCityFromPinCode,
  getStateHelplineDetails, getLabsForAState
} from '../Api/index';

import { getBrowser } from '../helpers/BrowserDetection';

import { getLabs } from '../helpers/LabHelpers';

const DATE_FORMAT = 'DD/MM/YYYY';

class Home extends Component {
  searchDebounced = null;

  constructor(props) {
    super(props);
    const showAskForLocation = window.location.href.indexOf('https') > -1;
    const IS_SAFARI = getBrowser() === 'Safari';
    this.state = {
      searchQuery: null,
      isQuerying: false,
      location: {},
      errors: {},
      showAskForLocation,
      activities: [],
      placeData: {},
      helplineData: {},
      zoneData: {},
      labs: {},
      isSafari: IS_SAFARI,
    };
    this.map = null;
    this.defaultLocation = { lat: 20.7492073, lng: 73.7042651 };
    this.autocomplete = null;
  }

  componentDidMount() {
    const options = {
      componentRestrictions: { country: 'in' }
    };

    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: this.defaultLocation,
      zoom: 6
    });
    const input = document.getElementById('search-input');
    this.autocomplete = new window.google.maps.places.Autocomplete(input, options);
    this.autocomplete.bindTo('bounds', this.map);
    this.autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']
    );
    this.autocomplete.addListener('place_changed', this.autocompleteInputListener);
  }

  autocompleteInputListener = () => {
    const place = this.autocomplete.getPlace();
    this.cancelTextBasedSearch();
    this.handleGoogleResponse(place);
  }

  handleGoogleResponse = (place) => {
    const placeData = {};
    _.each(place.address_components, (atr) => {
      const isCityPresent = _.includes(atr.types, 'administrative_area_level_2') || _.includes(atr.types, 'locality');
      const isStatePresent = _.includes(atr.types, 'administrative_area_level_1');
      if (isCityPresent) {
        placeData.city = atr.long_name;
      } else if (isStatePresent) {
        placeData.state = atr.long_name;
      }
    });
    const { lat, lng } = place.geometry.location;
    window.sendEvents({
      category: 'google search',
      action: `${placeData.state}`,
      label: `${placeData.city}`
    });
    this.setState({
      isQuerying: true,
      errors: null,
      location: {
        lat: typeof lat === 'function' ? lat() : lat,
        lng: typeof lat === 'function' ? lng() : lat,
      },
      placeData,
      searchQuery: place.name,
    }, () => this.getZoneColorData());
  }

  cancelTextBasedSearch = () => {
    if (this.searchDebounced) {
      this.searchDebounced.cancel();
    }
  }

  resetData = () => ({
    errors: null,
    labs: {},
    zoneData: {},
    isQuerying: false,
    activities: [],
    helplineData: {},
    placeData: {},
  });

  debouncedSearch = (text, location, viaFourSq = false) => {
    this.searchDebounced = _.debounce(() => this.initiateSearch(text, location, viaFourSq), 650);
    this.searchDebounced();
  }

  updateSearchQuery = (event) => {
    const searchText = event.target.value || '';
    this.setState({
      searchQuery: searchText,
      ...this.resetData()
    });
    if (searchText.length >= 3) {
      this.cancelTextBasedSearch();
      // disabled input based search and only autocomplete search is given priority
      // this.debouncedSearch(searchText);
    }
  }

  geolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const viaFourSq = true;
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        window.sendEvents({
          category: 'covid',
          action: 'click',
          label: 'detect location'
        });
        this.setState({
          location: geolocation,
        }, () => this.initiateSearch('', this.state.location, viaFourSq));
      });
    }
  }

  getCity = (place) => {
    if (place.formatted_address) {
      const data = place.formatted_address.split(',');
      if (data.length >= 3) {
        return {
          city: data.slice(-3)[0],
          state: data.slice(-2)[0].replace(/([0-9]|\s)/g, '')
        };
      }
    }
    return {};
  }

  handleZoneData = (res) => {
    // 3rd network call post handling res
    window.scrollTo(0, 0);
    const mainContainer = document.getElementById('valign-id');
    const { placeData } = this.state;
    mainContainer.classList.remove('c19-valign-center');
    this.setState({
      zoneData: res.body.data,
      errors: null,
    }, () => getActivityData(res.body.data.zone, {
      cb: this.handleActivities,
      onError: (data) => {
        window.sendEvents({
          category: 'zone',
          action: 'error',
          label: `searched for state: ${placeData.state} district: ${placeData.city}`
        });
        this.setState({
          isQuerying: false,
          errors: data,
        });
      }
    }));
  }

  handleActivities = (data) => {
    this.setState({
      activities: data.body.data.activities,
      errors: null,
    }, this.fetchStateWiseHelplineData);
  }

  fetchStateWiseHelplineData = () => {
    // 4th network call
    getStateHelplineDetails(
      this.state.placeData.state,
      {
        cb: (res) => this.setState({
          helplineData: res.body.data,
          isQuerying: false,
        }, this.fetchLabsDataForState),
        onError: (err) => {
          console.log(err);
        }
      }
    );
  }

  getZoneColorData = () => {
    // 2nd network call
    const { placeData, errors } = this.state;
    getZoneColor(placeData, {
      cb: this.handleZoneData,
      onError: () => {
        window.sendEvents({
          category: 'zone',
          action: 'fetch-error',
          label: `queried for ${placeData.state} ${placeData.city}`
        });
        this.setState({
          isQuerying: false,
          errors: {
            ...errors,
            zoneData: 'Data for pincode is not available as of now.\n We are continously updating our database.'
          },
        });
      }
    });
  }

  callback = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        const placeData = this.getCity(place);
        this.setState({
          isQuerying: false,
          errors: null,
          searchQuery: placeData.city,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          placeData: this.getCity(place)
        }, () => this.getZoneColorData());
        break;
      }
    }
  }

  handleLabsData = (res) => {
    const { searchQuery, placeData } = this.state;
    this.setState({
      isQuerying: false,
      labs: {
        areaWise: getLabs('zip', searchQuery, res.body.data.labs),
        stateWise: getLabs('state', placeData.state, res.body.data.labs),
        cityWise: getLabs('city', placeData.city, res.body.data.labs),
      }
    });
  }

  fetchLabsDataForState = () => {
    // network call
    getLabsForAState(this.state.placeData.state, {
      cb: this.handleLabsData,
      onError: (err) => {
        this.setState({
          errors: err,
          isQuerying: false,
        });
      }
    });
  }

  fetchDatafromMaps = (searchText = '', location = null) => {
    const request = {
      location: location ||
        (!_.isEmpty(this.state.location) && this.state.location) || this.defaultLocation,
      radius: '500',
      query: searchText
    };
    const service = new window.google.maps.places.PlacesService(this.map);
    service.textSearch(request, this.callback);
  }

  handleFourSquareData = (res) => {
    const { results, status } = res.body;
    this.setState({
      isQuerying: false,
      errors: null,
    }, () => {
      this.handleGoogleResponse(results[0]);
    });
  }

  initiateSearch = (searchText = '', location = null, viaFourSq = false) => {
    const { errors } = this.state;
    // google endpoint
    this.setState({ isQuerying: true });
    if (!location) {
      // this.searchCityViaPincode(searchText);
      this.fetchDatafromMaps(searchText);
    } else if (viaFourSq) {
      getDataFromLatLang(location.lat, location.lng, {
        cb: this.handleFourSquareData,
        onError: (err) => {
          console.log(err);
          this.setState({
            errors: { ...errors, pincode: err },
            isQuerying: false,
          });
        }
      });
    } else {
      this.fetchDatafromMaps(searchText);
    }
  }

  searchCityViaPincode = (searchText) => {
    // 1st network call
    if (searchText) {
      getCityFromPinCode(searchText, {
        cb: (res) => {
          const data = res.body.data[0];
          this.setState({
            placeData: {
              city: data.district === 'Bangalore' ? 'Bengaluru' : data.district,
              state: data.state_name,
              errors: null,
            },
            isQuerying: false,
          }, () => {
            this.fetchDatafromMaps(searchText, null, false);
            this.getZoneColorData();
          });
        },
        onError: (err) => {
          this.setState({
            ...this.resetData(),
            isQuerying: false,
            errors: { pincode: 'Data for this pincode not found' }
          })
          console.log(err);
        }
      });
    }
  }

  renderCovidCases = (label, value, color) => {
    return (
      <div className='card'>
        <div className='card-body text-center'>
          <p>
            {label}
          </p>
          <p className={`${!value ? '' : color} count`}>
            {value ? value : 0}
          </p>
        </div>
      </div>
    );
  }

  renderLabTitle = (title) => {
    return (
      <h3 className='covid-lab-title'>
        {title}
      </h3>
    );
  }

  render() {
    const {
      searchQuery, isQuerying, activities, helplineData, zoneData, errors, location,
      showAskForLocation, labs, placeData, isSafari
    } = this.state;
    return (
      <div className="App c19-valign-center" id="valign-id">
        <div className="container c-19-main-wrapper">
          <div className='animated fadeInDown'>
            <div className="row">
              <div className="col-12">
                <div className='header-container'>
                  <Header
                    title="COVID-19 Lockdown Handbook"
                    description="Find out what's allowed and restricted in your area during the COVID-19 lockdown."
                  />
                </div>
                <SearchInput
                  placeholder="Pincode/ City or Locality name"
                  inputChangeHandler={this.updateSearchQuery}
                  value={searchQuery}
                  isLoading={isQuerying}
                />
                {showAskForLocation && !isSafari ? (
                  <div>
                    <p className="text-center c19-info-text">
                      or
                    </p>
                    <div className="text-center link-blue-color">
                      <a className='text-link' onClick={this.geolocate} data-event=''>
                        <span><i className='fas fa-location-arrow fa-sm link-blue-color' /></span> Detect my location
                      </a>
                    </div>
                  </div>
                ) : null
              }
              </div>
            </div>
          </div>
          {
            !_.isEmpty(errors) && (
              <div className='row'>
                <div className='col-12 text-center my-3'>
                  We could not find data for this location.
                  <br />
                  Please try searching for a different location in India.
                  <br />
                  We are continously working on updating our website.
                </div>
              </div>
            )
          }
          <GoogleMaps
            searchQuery={searchQuery}
            location={location}
            map={this.map}
            showMap={!_.isEmpty(searchQuery) && searchQuery.length > 3 && !_.isEmpty(placeData)}
          />
          {
            _.isEmpty(errors) && !_.isEmpty(zoneData) && (
              <React.Fragment>
                <div className='row'>
                  <div className='col-12'>
                    <StatusCard
                      city={this.state.placeData.city}
                      state={this.state.placeData.state}
                      status={(zoneData && zoneData.zone) || 'red'}
                    />
                    <div className='c19-total-stats'>
                      <div className='text-center title mb-2'>COVID-19 Cases</div>
                      <div className="card-deck">
                        {this.renderCovidCases('Total Cases', zoneData.total_cases, 'orange')}
                        {this.renderCovidCases('Total Recovered', zoneData.total_recovered, 'green')}
                        {this.renderCovidCases('Total Deaths', zoneData.total_deaths, 'red')}
                      </div>
                      <p className='text-center helpline-text micro-text mt-3'>
                        This data was Last updated on:
                        {
                          moment(zoneData.last_updated_at, DATE_FORMAT).format('Do MMM, YYYY')
                        }
                      </p>
                    </div>
                    <div className='card helpline-card'>
                      <div className='text-center'>
                        <div className='helpline-text contact-text'>
                          <span>
                            <HelplineIcon />
                            <span>Helpline Number: </span>
                          </span>
                          {_.map(helplineData.covid_helpline_numbers, (number, index) => {
                            return (
                              <span>
                                <a
                                  href={`tel:${number.replace(/[^0-9]/g, '')}`}
                                  onClick={() => {
                                    window.sendEvents({
                                      category: 'covid',
                                      action: 'click',
                                      label: `helpline-number ${number}`
                                    });
                                  }}
                                  className='trigger-event'
                                >
                                  {number}
                                </a>
                                {(index !== helplineData.covid_helpline_numbers.length - 1) ? `${' / '}` : ''}
                              </span>
                            );
                          })}
                        </div>
                        <div className='helpline-text mt-2'>
                          <a href="#c19-lab-list" className='micro-text' onClick={() => {
                            window.sendEvents({
                              category: 'covid',
                              action: 'click',
                              label: 'view labs'
                            });
                            $('.accordion-title-link').trigger('click');
                          }}
                          >
                            Looking for COVID 19 testing centres near you?
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className='mb-3'>
                      <Share />
                    </div>
                  </div>
                </div>
                <div className='row no-gutters status-card-container'>
                  <div className='col-12'>
                    <div className='mb-3'>
                      <CategorySearchInput
                        placeholder='Search by category'
                      />
                    </div>
                    <CategoryCards activities={activities} />
                  </div>
                </div>
                <div id="c19-lab-list">
                  {labs && !_.isEmpty(labs.areaWise) && false && (
                    <div className='status-card-container my-3'>
                      {this.renderLabTitle('Covid Statewise Lab')}
                      <div className="accordion" id="covid-area-lab-accordion">
                        <div className="card accordion-category-header" id="area-wise-accordion-heading">
                          <div className="card-header" id='state-area-accordion-heading'>
                            <div className='collapsed accordion-title-link' data-toggle="collapse" data-target="#state-area-accordion" aria-expanded="true" aria-controls="state-area-accordion">
                              <span className='d-inline-block mr-2'><i className='fas fa-flask fa-sm' /></span>
                              <span>State Wise - Labs</span>
                              <div className='arrow-down'>
                                <AccordionToggleIcon />
                              </div>
                            </div>
                          </div>
                          <div id="state-area-accordion" className="collapse" aria-labelledby="area-wise-accordion-heading" data-parent="#covid-area-lab-accordion">
                            <div className="card-body">
                              <div className='c19-status-section'>
                                <div className='row row-cols-1 row-cols-sm-3 no-gutters'>
                                  {_.map(labs.areaWise, (lab) => {
                                    return (
                                      <div className='col mb-4'>
                                        <div className='c19-status-card c19-lab-card card h-100'>
                                          <div className="card-body">
                                            <a
                                              href={lab.readmore}
                                              target='_blank'
                                              rel='noopener noreferrer'
                                              className='mb-2 trigger-event'
                                              data-action="click"
                                              data-category="lockdown-handbook"
                                              data-label="areawise-lab-title"
                                            >
                                              {lab.title}
                                            </a>
                                            <div>{lab.address}</div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {labs && !_.isEmpty(labs.stateWise) && (
                    <div className='status-card-container my-3'>
                      {this.renderLabTitle('Covid Statewise Lab')}
                      <div className="accordion" id="covid-state-lab-accordion">
                        <div className="card accordion-category-header" id="state-wise-accordion-heading">
                          <div className="card-header" id='state-wise-accordion-heading'>
                            <div className='collapsed accordion-title-link' data-toggle="collapse" data-target="#state-wise-accordion" aria-expanded="true" aria-controls="state-wise-accordion">
                              <span className='d-inline-block mr-2'><i className='fas fa-flask fa-sm' /></span>
                              <span>State Wise - Labs</span>
                              <div className='arrow-down'>
                                <AccordionToggleIcon />
                              </div>
                            </div>
                          </div>
                          <div id="state-wise-accordion" className="collapse" aria-labelledby="state-wise-accordion-heading" data-parent="#covid-state-lab-accordion">
                            <div className="card-body">
                              <div className='c19-status-section'>
                                <div className='row row-cols-1 row-cols-sm-3 no-gutters'>
                                  {_.map(labs.stateWise, (lab) => {
                                    return (
                                      <div className='col mb-4'>
                                        <div className='c19-status-card c19-lab-card card h-100'>
                                          <div className="card-body">
                                            <a
                                              href={`https://covid.icmr.org.in${lab.readmore}`}
                                              target='_blank'
                                              onClick={() => {
                                                window.sendEvents({
                                                  category: 'covid',
                                                  action: 'click',
                                                  label: `open lab: ${lab.title}`
                                                });
                                              }}
                                              rel='noopener noreferrer'
                                              className='mb-2 trigger-event'
                                              data-action="click"
                                              data-category="lockdown-handbook"
                                              data-label="statewise-lab-title"
                                            >
                                              {lab.title}
                                            </a>
                                            <div>{lab.address}</div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className='row'>
                  <div className='col s12 text-center mt-3'>
                    <div className='card d-inline-block'>
                      <a
                        className='feedback-link feedback-link m-0 p-2 trigger-event'
                        href="https://forms.gle/We9AowVkcbF43WjH8"
                        target='_blank'
                        rel='noopener noreferrer'
                        data-action="click"
                        onClick={() => {
                          window.sendEvents({
                            category: 'covid',
                            action: 'click',
                            label: 'submit feedback'
                          });
                        }}
                        data-category="lockdown-handbook"
                        data-label="submit-feedback"
                      >
                        <i className='far fa-comment-alt fa-sm link-blue-color mr-2' />
                        Submit Feedback
                      </a>
                    </div>
                  </div>
                </div>
                <Footer text="Disclaimer: We use state and national government bulletins and official handles to update our numbers. The date and time of the update of the information is shared. The data available here might vary from other sources depending on the time of update." />
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

export default Home;
