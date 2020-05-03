import React, { Component } from 'react';

import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import CategorySearchInput from '../components/CategorySearchInput';
import GoogleMaps from '../components/GoogleMaps';
import CategoryCards from '../components/CategoryCards';
import StatusCard from '../components/StatusCard';
import {
  getActivityData, getDataFromLatLang, getZoneColor, getCityFromPinCode,
  getStateHelplineDetails
} from '../Api/index';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: null,
      isQuerying: false,
      location: {},
      error: null,
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
      error: null,
      activities: [],
      placeData: {},
    });
    if (searchText.length === 6) {
      this.initiateSearch(searchText);
    }
  }

  geolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.setState({
          location: geolocation,
        });
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
    }, () => getActivityData(res.body.data.zone, {
        cb: this.handleActivities,
        onError: (data) => this.setState({
          isQuerying: false,
          error: data,
        })
      })
    );
  }

  handleActivities = (data) => {
    this.setState({
      activities: data.body.data.activities,
    }, );
  }

  fetchStateWiseHelplineData = () => {
    getStateHelplineDetails(
      this.state.placeData.state,
      {
        cb: (res) => this.setState({
          helplineData: res.data,
          isQuerying: false,
        })
      }
    );
  }

  getZoneColorData = () => {
    const { placeData } = this.state;
    getZoneColor(placeData, {
      cb: this.handleZoneData,
      onError: (data) => this.setState({
        isQuerying: false,
        error: data,
      })
    });
  }

  callback = (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        console.log(place);
        this.setState({
          isQuerying: true,
          placeData: this.getCity(place)
        }, () => this.getZoneColorData());
        break;
      }
    }
  }

  initiateSearch = (searchText = '', location = null) => {
    this.setState({ isQuerying: true });
    if (!location) {
      this.searchCityViaPincode(searchText);
    } else {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
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
  }

  searchCityViaPincode = (searchText) => {
    if (searchText) {
      getCityFromPinCode(searchText, {
        cb: (res) => {
          const data = res.body.data[0];
          this.setState({
            placeData: {
              city: data.district === 'Bengaluru' ? 'Bangalore' : data.district,
              state: data.state_name,
            }
          }, () => this.getZoneColorData());
        },
        onError: (err) => {
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

  render() {
    const { searchQuery, isQuerying, activities, helplineData, zoneData } = this.state;
    return (
      <div className="App">
        <div className="container c-19-main-wrapper">
          <div className="row">
            <div className="col s12">
              <Header title="React App" description='Usefull application' />
              <SearchInput
                placeholder="Enter your Pincode"
                inputChangeHandler={this.updateSearchQuery}
                value={searchQuery}
                isLoading={isQuerying}
              />
              <p className="text-center c19-info-text">
                or
              </p>
              <div className="text-center">
                <button type='button' className='text-link' onClick={this.geolocate}>
                  Use device location
                </button>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col s12'>
              <StatusCard city={this.state.placeData.city} status={(zoneData && zoneData.zone) || 'red'} />
              <GoogleMaps
                searchQuery={searchQuery}
              />
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
          <div className='row'>
            <div className='col s12'>
              <div>Help Line</div>
              {_.map(helplineData, (data) => {
                return _.map(data.covid_helpline_numbers, (number) => {
                  return <a href={`tel:${number}`}>{number}</a>
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
