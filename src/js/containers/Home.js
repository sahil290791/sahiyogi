import React, { Component } from 'react';
import Header from '../components/Header';
import CategoryStatusTitle from '../components/CategoryStatusTitle';
import SearchInput from '../components/SearchInput';
import GoogleMaps from '../components/GoogleMaps';
// import InfoBanner from '../components/InfoBanner';
import StatusCard from '../components/StatusCard';
import StatusTile from '../components/StatusTile';
import AccordionToggleIcon from '../components/AccordionToggleIcon';
import { getDataFromPincode, getDataFromLatLang } from '../api/index';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: null,
      isQuerying: false,
      location: null,
      city: null,
      error: null
    };
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

  initiateSearch(searchText) {
    this.setState({ isQuerying: true });
    getDataFromPincode(searchText, {
      cb: (data) => {
        const { location } = data.candidates[0].geometry;
        this.setState({
          location,
        });
        this.initiateCitySearch(location);
      },
      onError: () => {
        this.setState({
          isQuerying: false,
          location: null,
          error: 'Location not found'
        });
      }
    });
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
                <a href="#" className='text-link'>
                  Use device location
                </a>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col s12'>
              <StatusCard city='Bangalore' status='red' />
              <GoogleMaps
                searchQuery={searchQuery}
              />
            </div>
          </div>
          <div className='row no-gutters status-card-container'>
            <div className='col-12'>
              <div className="accordion" id="category-accordion">
                <div className="card">
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
                <div className="card">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
