import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import CategorySearchInput from '../components/CategorySearchInput';
import LocationIcon from '../components/LocationIcon';
import HelplineIcon from '../components/HelplineIcon';
import AccordionToggleIcon from '../components/AccordionToggleIcon';
import GoogleMaps from '../components/GoogleMaps';
import CategoryCards from '../components/CategoryCards';
import StatusCard from '../components/StatusCard';
import {
  getActivityData, getDataFromLatLang, getZoneColor, getCityFromPinCode,
  getStateHelplineDetails, getLabsForAState
} from '../Api/index';

import { getLabs } from '../helpers/labsHelpers';

const DATE_FORMAT = 'DD/MM/YYYY';

class Home extends Component {
  constructor(props) {
    super(props);
    const showAskForLocation = window.location.href.indexOf('https') > -1;
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
    };
    this.map = null;
    this.defaultLocation = { lat: 20.7492073, lng: 73.7042651 };
  }

  componentDidMount() {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: this.defaultLocation,
      zoom: 6
    });
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

  updateSearchQuery = (event) => {
    const searchText = event.target.value || '';
    if (searchText.length > 6) {
      return;
    }
    this.setState({
      searchQuery: searchText,
      ...this.resetData()
    });
    if (searchText.length === 6) {
      this.initiateSearch(searchText);
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
    this.setState({
      zoneData: res.body.data,
      errors: null,
    }, () => getActivityData(res.body.data.zone, {
      cb: this.handleActivities,
      onError: (data) => this.setState({
        isQuerying: false,
        errors: data,
      })
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
        }, this.fetchLabsDataForState)
      }
    );
  }

  getZoneColorData = () => {
    // 2nd network call
    const { placeData, errors } = this.state;
    getZoneColor(placeData, {
      cb: this.handleZoneData,
      onError: (data) => this.setState({
        isQuerying: false,
        errors: {
          ...errors,
          zoneData: 'Data for pincode is not available as of now.\n We are continously updating our database.'
        },
      })
    });
  }

  callback = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        this.setState({
          isQuerying: false,
          errors: null,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          // placeData: this.getCity(place)
        });
        // , () => this.getZoneColorData()
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
    const venues = res.body.response && res.body.response.venues;
    const venue = _.find(venues, (data) => {
      return data.location && data.location.postalCode;
    }) || {};
    console.log('fs:', res.body.data);
    this.setState({
      searchQuery: venue.location.postalCode,
      errors: null,
      location: {
        lat: venue.location.lat,
        lng: venue.location.lng
      },
    }, () => {
      this.fetchDatafromMaps(this.state.searchQuery, this.state.location)
      this.getZoneColorData();
    });
  }

  initiateSearch = (searchText = '', location = null, viaFourSq = false) => {
    const { errors } = this.state;
    // google endpoint
    this.setState({ isQuerying: true });
    if (!location) {
      this.searchCityViaPincode(searchText);
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
      <div className='col-12 col-sm-4 text-center'>
        <p>
          {label}
        </p>
        <p className={`${!value ? '' : color} count ${!value ? 'small-text' : ''}`}>
          {value ? value : 'Data currently not available with us'}
        </p>
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
      showAskForLocation, labs, placeData
    } = this.state;
    return (
      <div className="App c19-valign-center">
        <div className="container c-19-main-wrapper">
          <div className='animated fadeInDown'>
            <div className="row">
              <div className="col-12">
                <div className='header-container'>
                  <Header
                    title="Lockdown Handbook"
                    description="Find out what's allowed and restricted in your area during the COVID-19 lockdown."
                  />
                </div>
                <SearchInput
                  placeholder="Enter your Pincode"
                  inputChangeHandler={this.updateSearchQuery}
                  value={searchQuery}
                  isLoading={isQuerying}
                />
                {showAskForLocation && (
                  <div>
                    <p className="text-center c19-info-text">
                      or
                    </p>
                    <div className="text-center">
                      <a className='text-link' onClick={this.geolocate}>
                        Use device location
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {
            !_.isEmpty(errors) && (
              <div className='row'>
                <div className='col-12 text-center my-3'>
                  We could not find data for this pincode.
                  <br />
                  Do not worry we are continously working on updating the website.
                </div>
              </div>
            )
          }
          {!_.isEmpty(placeData) && (
            <p className='text-center text-capitalize'>
              <LocationIcon />
              <span className='align-middle'>
                {placeData.city}, {placeData.state.toLowerCase()}
              </span>
            </p>
          )}
          <GoogleMaps
            searchQuery={searchQuery}
            location={location}
            map={this.map}
            showMap={!_.isEmpty(searchQuery) && searchQuery.length === 6 && !_.isEmpty(placeData)}
          />
          {
            _.isEmpty(errors) && !_.isEmpty(zoneData) && (
              <React.Fragment>
                <div className='row'>
                  <div className='col-12'>
                    <p className='text-center helpline-text micro-text'>
                      This data was Last updated on:
                      {
                        moment(zoneData.last_updated_at, DATE_FORMAT).format('Do MMM, YYYY')
                      }
                    </p>
                    <StatusCard city={this.state.placeData.city} status={(zoneData && zoneData.zone) || 'red'} />
                    <div className='c19-total-stats'>
                      <div className='text-center title mb-2'>COVID-19 Cases</div>
                      <div className='row'>
                        {this.renderCovidCases('Total Cases', zoneData.total_cases, 'orange')}
                        {this.renderCovidCases('Total Recovered', zoneData.total_recovered, 'green')}
                        {this.renderCovidCases('Total Deaths', zoneData.total_deaths, 'red')}
                        <div className='col-12 helpline-text text-center mt-3 mb-0'>
                          <span>
                            <HelplineIcon />
                            <span>Helpline Number: </span>
                          </span>
                          {_.map(helplineData.covid_helpline_numbers, (number, index) => {
                            return (
                              <span>
                                <a href={`tel:${number}`}>
                                  {number}
                                </a>
                                {(index !== helplineData.covid_helpline_numbers.length - 1) ? `${' / '}` : ''}
                              </span>
                            );
                          })}
                        </div>
                        <div className='col-12 helpline-text text-center my-2'>
                          <a href="#state-wise-accordion-heading" className='micro-text'>
                            Looking for COVID 19 testing centres near you?
                          </a>
                        </div>
                      </div>
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
                {labs && !_.isEmpty(labs.areaWise) && (
                  <div className='status-card-container my-3'>
                    {this.renderLabTitle('Covid Statewise Lab')}
                    <div className="accordion" id="covid-area-lab-accordion">
                      <div className="card accordion-category-header" id="area-wise-accordion-heading">
                        <div className="card-header" id='state-area-accordion-heading'>
                          <div className='collapsed accordion-title-link' data-toggle="collapse" data-target="#state-area-accordion" aria-expanded="true" aria-controls="state-area-accordion">
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
                                            className='mb-2'
                                          >
                                            {lab.title}
                                          </a>
                                          <div>{lab.address}</div>
                                          <div>{lab.description}</div>
                                          <div>{lab.city}</div>
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
                                            rel='noopener noreferrer'
                                            className='mb-2'
                                          >
                                            {lab.title}
                                          </a>
                                          <div>{lab.address}</div>
                                          <div>{lab.description}</div>
                                          <div>{lab.city}</div>
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
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

export default Home;
