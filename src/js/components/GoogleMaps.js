import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GoogleMaps extends Component {
  static getDerivedStateFromProps(props, state) {
    return {
      searchQuery: props.searchQuery
    };
  }

  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      // isWaiting: true,
      searchQuery: {},
      location: {},
    };
  }

  componentDidMount() {
    this.initMap();
  }

  updatePosition = () => {
    this.map.setCenter({ lat: -34, lng: 151 });
    new google.maps.Marker({ position: { lat: -34, lng: 151 }, map: this.map });
  }

  initMap = () => {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }

  render() {
    return (
      <div id='map' />
    );
  }
}

GoogleMaps.defaultProps = {
  searchQuery: null,
};

GoogleMaps.propTypes = {
  searchQuery: PropTypes.string,
};

export default GoogleMaps;
