import React from 'react';
import PropTypes from 'prop-types';

const StatusCard = (props) => {
  const { city, status } = props;
  const cardTheme = {
    containment: 'containment',
    red: 'red',
    orange: 'orange',
    green: 'green',
  };

  return (
    <div className={`text-center c19-status-banner ${cardTheme[status]}`}>
      <p>
        {`You are in ${city}. It falls under`}
        <span className='c-19-status-zone'>
          {` ${status} `}
        </span>
        zone.
      </p>
    </div>
  );
};

StatusCard.defaultProps = {
  status: 'red',
};

StatusCard.propTypes = {
  city: PropTypes.string.isRequired,
  status: PropTypes.string,
};

export default StatusCard;
