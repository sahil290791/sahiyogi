import React from 'react';
import PropTypes from 'prop-types';

const StatusCard = (props) => {
  const { city, state, status } = props;
  const cardTheme = {
    containment: 'containment',
    red: 'red',
    orange: 'orange',
    green: 'green',
  };

  if (!city) {
    return null;
  }

  if (!state) {
    return null;
  }

  return (
    <div className={`text-center c19-status-banner ${cardTheme[status]}`}>
      <p>
        {`You are located at ${city}, `}
        <span className='text-capitalize'>{`${state.toLowerCase()}. `}</span>
        It falls under
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
  state: PropTypes.string.isRequired,
  status: PropTypes.string,
};

export default StatusCard;
