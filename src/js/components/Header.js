import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  const { title, description } = props;
  return (
    <header className="c19-header">
      <h1>{title}</h1>
      <p className='text-center c19-info-text'>{description}</p>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Header;
