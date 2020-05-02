import React, { Component } from 'react';

import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import InfoCard from '../components/InfoCard';
import GoogleMaps from '../components/GoogleMaps';


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
              <InfoCard cardType="info">
                <p>Welcome</p>
              </InfoCard>
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
        </div>
      </div>
    );
  }
}

export default Home;
