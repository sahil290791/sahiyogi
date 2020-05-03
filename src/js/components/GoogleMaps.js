import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

class GoogleMaps extends Component {
  static getDerivedStateFromProps(props, state) {
    return {
      searchQuery: props.searchQuery,
      location: props.location,
      map: props.map,
      showMap: props.showMap,
    };
  }

  constructor(props) {
    super(props);
    this.infoWindow = null;
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
    if (prevProps.location.lat !== this.state.location.lat && this.state.location.lat) {
      this.updatePosition();
    }
  }

  updatePosition = () => {
    const defaultLocation = this.state.location || { lat: 20.7492073, lng: 73.7042651 };
    this.infoWindow.setPosition(defaultLocation);
    this.infoWindow.setContent('Location found.');
    this.infoWindow.open(this.state.map);
    new window.google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      zoom: 8
    });
    // this.map.setCenter(defaultLocation);
    // new google.maps.Marker({ position: { ...defaultLocation }, map: this.map });
  }

  initMap = () => {
    this.infoWindow = new google.maps.InfoWindow;
  }

  render() {
    const { searchQuery } = this.state;
    return (
      <div className={`container ${this.state.showMap ? '' : 'd-none'}`}>
        <div className='row map-container mb-2'>
          <div id='map' className='col s12 google-map box-shadow' />
        </div>
      </div>
    );
  }
}

GoogleMaps.defaultProps = {
  searchQuery: null,
  location: { lat: 20.7492073, lng: 73.7042651 },
};

GoogleMaps.propTypes = {
  searchQuery: PropTypes.string,
  location: PropTypes.object,
  map: PropTypes.object.isRequired,
  showMap: PropTypes.bool.isRequired,
};

export default GoogleMaps;
