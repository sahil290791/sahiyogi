import React, { Component } from 'react';
import Header from '../components/Header';
import CategoryStatusTitle from '../components/CategoryStatusTitle';
import SearchInput from '../components/SearchInput';
import CategorySearchInput from '../components/CategorySearchInput';
import GoogleMaps from '../components/GoogleMaps';
// import InfoBanner from '../components/InfoBanner';
import StatusCard from '../components/StatusCard';
import StatusTile from '../components/StatusTile';
import AccordionToggleIcon from '../components/AccordionToggleIcon';
import { getActivityData, getDataFromLatLang, getZoneColor, getCityFromPinCode } from '../Api/index';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: null,
      isQuerying: false,
      location: {},
      error: null,
      activities: {},
      placeData: {}
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
    console.log('res', res);
    getActivityData(res.body.data.zone, {
      cb: this.handleActivities,
      onError: (data) => this.setState({
        isQuerying: false,
        error: data,
      })
    });
  }

  handleActivities = (data) => {
    this.setState({
      activities: data.body,
    });
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
    this.searchCityViaPincode(searchText);
    // const map = new window.google.maps.Map(document.getElementById('map'), {
    //   zoom: 15,
    //   center: this.india,
    // });
    //
    // const request = {
    //   location: location || this.india,
    //   radius: '500',
    //   fields: ['address_component'],
    //   query: searchText
    // };
    // const service = new window.google.maps.places.PlacesService(map);
    // service.textSearch(request, this.callback);
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
    const { searchQuery, isQuerying } = this.state;
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
              <StatusCard city={this.state.placeData.city} status='red' />
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
              <div className="accordion" id="category-accordion">
                <div className="card accordion-category-header">
                  <div className="card-header" id="headingOne">
                    <div className="accordion-title-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <span>Health Care</span>
                      <div className='arrow-down'>
                        <AccordionToggleIcon />
                      </div>
                    </div>
                  </div>
                  <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#category-accordion">
                    <div className="card-body">
                      <div className='c19-status-section'>
                        <CategoryStatusTitle status='allowed' title='Allowed' />
                        <div className='card-group'>
                          <StatusTile status='allowed' title="Health Care" description="Hello World" />
                          <StatusTile status='allowed' title="Health Care" description="Helloafkafjalfkja lkfaj lajflka World" />
                          <StatusTile status='allowed' title="Health Care" description="Helloafkafjalfkja lkfaj lajflka World" />
                        </div>
                      </div>
                      <div className='c19-status-section'>
                        <CategoryStatusTitle status='restricted' title='Restricted' />
                        <div className='card-group'>
                          <StatusTile status='notallowed' title="Health Care" description="Hello World" />
                          <StatusTile status='notallowed' title="Health Care" description="Helloafkafjalfkja lkfaj lajflka World" />
                          <StatusTile status='notallowed' title="Health Care" description="Helloafkafjalfkja lkfaj lajflka World" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card accordion-category-header">
                  <div className="card-header" id="headingTwo">
                    <div className="accordion-title-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      <span>Education</span>
                      <div className='arrow-down'>
                        <AccordionToggleIcon />
                      </div>
                    </div>
                  </div>
                  <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#category-accordion">
                    <div className="card-body">
                      <div className='c19-status-section'>
                        <CategoryStatusTitle status='allowed' title='Allowed' />
                        <div className='card-group'>
                          <StatusTile status='allowed' title="education" description="Hello World" />
                          <StatusTile status='allowed' title="education" description="Helloafkafjalfkja lkfaj lajflka World" />
                          <StatusTile status='allowed' title="education" description="Helloafkafjalfkja lkfaj lajflka World" />
                        </div>
                      </div>
                      <div className='c19-status-section'>
                        <CategoryStatusTitle status='restricted' title='Restricted' />
                        <div className='card-group'>
                          <StatusTile status='notallowed' title="education" description="Hello World" />
                          <StatusTile status='notallowed' title="education" description="Helloafkafjalfkja lkfaj lajflka World" />
                          <StatusTile status='notallowed' title="education" description="Helloafkafjalfkja lkfaj lajflka World" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
