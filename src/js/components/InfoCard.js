import React from 'react';
import PropTypes from 'prop-types';

const InfoCard = (props) => {
  const { children, cardType } = props;
  const cardTheme = {
    error: 'error',
    success: 'success',
    info: 'info',
  };

  return (
    <div className={`c19-info-card ${cardTheme[cardType]}`}>
      {children}
    </div>
  );
};

InfoCard.defaultProps = {
  cardType: 'info',
};

InfoCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ])),
  ]).isRequired,
  cardType: PropTypes.string,
};

export default InfoCard;
