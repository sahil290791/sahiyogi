import React from 'react';
import PropTypes from 'prop-types';

const StatusTile = (props) => {
  const { status, title, description } = props;
  const cardTheme = {
    allowed: 'allowed',
    notallowed: 'not-allowed',
  };
  return (
    <div className={`c19-status-card card ${cardTheme[status]}`}>
      <div className="card-body">
        <p className='card-title'>{title}</p>
        {{ description } && <p className='card-description'>{description}</p>}
      </div>
    </div>
  );
};

StatusTile.defaultProps = {
  status: 'allowed',
  description: ''
};

StatusTile.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default StatusTile;
