import React, { Component } from 'react';

import Header from '../components/Header';
import CategoryTitle from '../components/CategoryTitle';
import SearchInput from '../components/SearchInput';
import GoogleMaps from '../components/GoogleMaps';
import InfoBanner from '../components/InfoBanner';
import StatusTile from '../components/StatusTile';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: null,
    };
  }

  updateSearchQuery = (event) => {
    this.setState({
      searchQuery: event.target.value,
    });
  }

  render() {
    const { searchQuery } = this.state;
    return (
      <div className="App">
        <div className="container c-19-main-wrapper">
          <div className="row">
            <div className="col s12">
              <Header title="React App" />
              <InfoBanner cardType='info'>
                <p>Welcome</p>
              </InfoBanner>
              <SearchInput
                placeholder="Enter your Pincode"
                inputChangeHandler={this.updateSearchQuery}
                value={searchQuery}
              />
              <p className="text-center c19-info-text">
                or
              </p>
              <div className="text-center">
                <a href="#" className='text-link'>
                  Use device location
                </a>
              </div>
              <GoogleMaps
                searchQuery={searchQuery}
              />
            </div>
          </div>
          <div className='row no-gutters status-card-container'>
            <div className='col-12'>
              <div className='c19-status-section'>
                <CategoryTitle status='allowed' title='Allowed' />
                <div className='card-group'>
                  <StatusTile status='allowed' title="Health Care" description="Hello World" />
                  <StatusTile status='allowed' title="Health Care" description="Helloafkafjalfkja lkfaj lajflka World" />
                  <StatusTile status='allowed' title="Health Care" description="Helloafkafjalfkja lkfaj lajflka World" />
                </div>
              </div>
              <div className='c19-status-section'>
                <CategoryTitle status='restricted' title='Restricted' />
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
    );
  }
}

export default Home;
