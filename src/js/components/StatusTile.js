import React from 'react';
import PropTypes from 'prop-types';

import AllowIcon from './AllowIcon';
import RestrictIcon from './RestrictIcon';

const StatusTile = (props) => {
  const { status, title, description } = props;
  const cardTheme = {
    allowed: 'allowed',
    notallowed: 'not-allowed',
  };
  const statusIcon = cardTheme[status] === 'allowed' ? <AllowIcon /> : <RestrictIcon />;
  return (
    <div className={`c19-status-card card ${cardTheme[status]}`}>
      <div className="card-body">
        <div className='d-flex align-self-center align-items-center'>
          <div className='d-inline-flex mr-2'>
            {statusIcon}
          </div>
          <div className='d-inline-flex'>
            <p className='card-title'>{title}</p>
          </div>
        </div>
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
