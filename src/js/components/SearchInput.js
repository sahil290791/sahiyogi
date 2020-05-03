import React from 'react';
import PropTypes from 'prop-types';

import SearchInputLoaderIcon from './SearchInputLoaderIcon';
import SearchInputIcon from './SearchInputIcon';

function allowOnlyDigits(e) {
  const re = /[0-9]+/g;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
}

const SearchInput = (props) => {
  const {
    value, inputChangeHandler, disabled, placeholder, isLoading
  } = props;
  const icon = isLoading ? <SearchInputLoaderIcon /> : <SearchInputIcon />;
  const inputClass = isLoading || disabled ? 'disabled' : '';
  return (
    <div className={`c19-search-input-container ${inputClass}`}>
      <input
        className="c19-search-input c19-searchinput-js"
        type='text'
        pattern="[0-9]*"
        onKeyPress={allowOnlyDigits}
        value={value}
        placeholder={placeholder}
        onChange={inputChangeHandler}
        disabled={disabled}
        maxLength='6'
        inputMode='numeric'
      />
      <button type='button' className="c19-search-input-icon">
        {icon}
      </button>
    </div>
  );
};

SearchInput.defaultProps = {
  value: null,
  disabled: false,
  isLoading: false,
  placeholder: ''
};

SearchInput.propTypes = {
  inputChangeHandler: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
  // title: PropTypes.string.isRequired,
};

export default SearchInput;
