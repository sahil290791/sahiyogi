import React, { Component } from 'react';

import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import InfoCard from '../components/InfoCard';


class Home extends Component {
  render() {
    return (
      <div className="App">
        <div className='container c-19-main-wrapper'>
          <div className='row'>
            <div className='col s12'>
              <Header title="React App" />
              <InfoCard cardType='info'>
                <p>Welcome</p>
              </InfoCard>
              <SearchInput placeholder="Enter your Pincode" />
              <div className="mt-3 text-center">
                <a href="#" className='text-link'>
                  Use Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
