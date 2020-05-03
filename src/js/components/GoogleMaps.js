import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GoogleMaps extends Component {
  static getDerivedStateFromProps(props, state) {
    return {
      searchQuery: props.searchQuery,
      location: props.location,
    };
  }

  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      // isWaiting: true,
      searchQuery: null,
      location: {},
    };
  }

  componentDidMount() {
    this.initMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchQuery !== this.state.searchQuery && this.state.searchQuery) {
      this.updatePosition();
    }
  }

  updatePosition = () => {
    const defaultLocation = this.state.location || { lat: -34, lng: 151 };
    this.map.setCenter(defaultLocation);
    new google.maps.Marker({ position: defaultLocation, map: this.map });
  }

  initMap = () => {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='row map-container mb-2'>
          <div id='map' className='col s12 google-map box-shadow' />
        </div>
      </div>
    );
  }
}

GoogleMaps.defaultProps = {
  searchQuery: null,
  location: { lat: -34, lng: 151 },
};

GoogleMaps.propTypes = {
  searchQuery: PropTypes.string,
  location: PropTypes
};

export default GoogleMaps;
