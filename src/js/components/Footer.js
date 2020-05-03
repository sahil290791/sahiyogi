import React from 'react';
import PropTypes from 'prop-types';

const Footer = (props) => {
  const { text } = props;
  return (
    <footer className="c19-footer">
      <p className='text-center c19-info-text'>{text}</p>
    </footer>
  );
};

Footer.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Footer;
