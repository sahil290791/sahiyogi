import React from 'react';
import PropTypes from 'prop-types';

import SearchInputIcon from './SearchInputIcon';

const SearchInput = (props) => {
  const { value, inputChangeHandler, disabled, placeholder } = props;
  return (
    <div className='c19-search-input-container'>
      <input
        className="c19-search-input"
        type='numeric'
        pattern="[0-9]*"
        value={value}
        placeholder={placeholder}
        onChange={inputChangeHandler}
        disabled={disabled}
        maxLength='6'
        inputMode='numeric'
      />
      <button className={'c19-search-input-icon'}>
        <SearchInputIcon />
      </button>
    </div>
  );
};

SearchInput.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SearchInput;
