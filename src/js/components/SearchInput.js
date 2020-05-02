import React from 'react';
import PropTypes from 'prop-types';

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
    </div>
  );
};

SearchInput.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SearchInput;
