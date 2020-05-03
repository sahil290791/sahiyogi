import React from 'react';
import PropTypes from 'prop-types';

const StatusTile = (props) => {
  const { status, title, description } = props;
  const cardTheme = {
    allowed: 'allowed',
    notallowed: 'not-allowed',
  };
  let descriptionView = null;
  if (description) {
    descriptionView = (
      <p className='card-description'>{description}</p>
    );
  }

  return (
    <div className={`c19-status-card card h-100 ${cardTheme[status]}`}>
      <div className="card-body">
        <p className='card-title'>{title}</p>
        {descriptionView}
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
