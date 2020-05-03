import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import CategorySearchInput from '../components/CategorySearchInput';
import HelplineIcon from '../components/HelplineIcon';
import GoogleMaps from '../components/GoogleMaps';
import CategoryCards from '../components/CategoryCards';
import StatusCard from '../components/StatusCard';
import {
  getActivityData, getDataFromLatLang, getZoneColor, getCityFromPinCode,
  getStateHelplineDetails
} from '../Api/index';

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
    };
    this.map = null;
  }

  componentDidMount() {
    this.india = new window.google.maps.LatLng(20.7492073, 73.7042651);
  }

  updateSearchQuery = (event) => {
    const searchText = event.target.value || '';
    this.setState({
      searchQuery: searchText,
      errors: null,
      zoneData: {},
      isQuerying: false,
      activities: [],
      helplineData: {},
      placeData: {},
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
    getStateHelplineDetails(
      this.state.placeData.state,
      {
        cb: (res) => this.setState({
          helplineData: res.body.data,
          isQuerying: false,
        })
      }
    );
  }

  getZoneColorData = () => {
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
          isQuerying: true,
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

  fetchDatafromMaps = (searchText = '', location) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: this.india,
    });

    const request = {
      location: location || this.india,
      radius: '500',
      fields: ['address_component'],
      query: searchText
    };
    const service = new window.google.maps.places.PlacesService(map);
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
    }, () => this.fetchDatafromMaps(this.state.searchQuery, this.state.location));
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
    if (searchText) {
      getCityFromPinCode(searchText, {
        cb: (res) => {
          const data = res.body.data[0];
          this.setState({
            placeData: {
              city: data.district === 'Bangalore' ? 'Bengaluru' : data.district,
              state: data.state_name,
              errors: null,
            }
          }, () => {
            this.fetchDatafromMaps(searchText, null, false);
            this.getZoneColorData();
          });
        },
        onError: (err) => {
          this.setState({
            errors: { pincode: 'Data for this pincode not found' }
          })
          console.log(err);
        }
      });
    }
  }

  initiateCitySearch(location) {
    this.setState({ isQuerying: true });
    getDataFromLatLang(location.lat, location.lng, {
      cb: (data) => {
        const { venues } = data.response;
        // City might not be present first element
        const venue = venues.find((v) => v.location.city);
        if (venue) {
          const { city } = venue.location;
          this.setState({
            isQuerying: false,
            city,
          });
        } else {
          this.setState({
            isQuerying: false,
            city: null,
            error: 'Location not found'
          });
        }
      },
      onError: () => {
        this.setState({
          isQuerying: false,
          city: null,
          error: 'Location not found'
        });
      }
    });
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

  render() {
    const {
      searchQuery, isQuerying, activities, helplineData, zoneData, errors, location,
      showAskForLocation
    } = this.state;
    return (
      <div className="App">
        <div className="container c-19-main-wrapper">
          <div className="row">
            <div className="col s12">
              <Header title="Sahiyogi" description='Find covid related information for all districts' />
              <SearchInput
                placeholder="Enter your Pincode"
                inputChangeHandler={this.updateSearchQuery}
                value={searchQuery}
                isLoading={isQuerying}
              />
              <p className="text-center c19-info-text">
                or
              </p>
              {showAskForLocation && (
                <div className="text-center">
                  <a className='text-link' onClick={this.geolocate}>
                    Use device location
                  </a>
                </div>
              )}
            </div>
          </div>
          {
            !_.isEmpty(errors) && (
                <div className='row'>
                  <div className='col s12'>
                    We could not find data for this pincode. Do not worry we are continously
                     working on updating the website.
                  </div>
                </div>
            )
          }
          <GoogleMaps searchQuery={searchQuery} location={location} />
          {
            _.isEmpty(errors) && !_.isEmpty(zoneData) && (
              <React.Fragment>
                <div className='row'>
                  <div className='col s12'>
                    <div className='col s12'>
                      This data was Last updated on: {moment(zoneData.last_updated_at, DATE_FORMAT).format('Do MMM, YYYY')}
                    </div>
                    <StatusCard city={this.state.placeData.city} status={(zoneData && zoneData.zone) || 'red'} />
                    <div className='c19-total-stats'>
                      <div className='text-center title mb-2'>COVID-19 Cases</div>
                      <div className='row'>
                        {this.renderCovidCases('Total Cases', zoneData.total_cases, 'orange')}
                        {this.renderCovidCases('Total Recovered', zoneData.total_recovered, 'green')}
                        {this.renderCovidCases('Total Deaths', zoneData.total_deaths, 'red')}
                        <div className='col-12 helpline-text text-center'>
                          <span>
                            <HelplineIcon />
                            Helpline Number:
                          </span>
                          {_.map(helplineData.covid_helpline_numbers, (number) => {
                            return (
                              <a href={`tel:${number}`}>
                                {` ${number}`}
                              </a>
                            );
                          })}
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
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

export default Home;
