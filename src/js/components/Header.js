import React from 'react';
import PropTypes from 'prop-types';
import ScripboxLogo from './ScripboxLogo';

const Header = (props) => {
  const { title, description } = props;
  return (
    <header className="c19-header">
      <h1>{title}</h1>
      <div className='d-flex flex-direction-row justify-content-center align-items-center mb-3'>
        <div className='d-flex powered-by-text mr-1'>Powered by</div>
        <div className='d-flex'><ScripboxLogo /></div>
      </div>
      <p className='text-center c19-info-text'>{description}</p>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Header;
