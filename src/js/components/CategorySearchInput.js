import React from 'react';
import PropTypes from 'prop-types';

import SearchInputLoaderIcon from './SearchInputLoaderIcon';
import SearchInputIcon from './SearchInputIcon';

const CategorySearchInput = (props) => {
  const {
    disabled, placeholder, isLoading
  } = props;
  const icon = isLoading ? <SearchInputLoaderIcon /> : <SearchInputIcon />;
  const inputClass = isLoading || disabled ? 'disabled' : '';
  return (
    <div className={`col-12 col-sm-4c19-search-input-container ${inputClass}`}>
      <input
        className="c19-search-input c19-category-search-input"
        placeholder={placeholder}
        type="text"
        maxLength="50"
      />
      <button type='button' className="c19-search-input-icon">
        {icon}
      </button>
    </div>
  );
};

CategorySearchInput.defaultProps = {
  disabled: false,
  isLoading: false,
  placeholder: ''
};

CategorySearchInput.propTypes = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default CategorySearchInput;
