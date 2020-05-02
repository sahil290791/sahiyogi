import React from 'react';
import PropTypes from 'prop-types';

import AllowIcon from './AllowIcon';
import RestrictIcon from './RestrictIcon';

const CategoryStatusTitle = (props) => {
  const { title, status } = props;
  const statusIcon = status === 'allowed' ? <AllowIcon /> : <RestrictIcon />;
  const statusClass = status === 'allowed' ? 'allowed' : 'restricted';

  return (
    <div className='c19-category-title'>
      <div className='d-flex align-self-center align-items-center'>
        <div className='d-inline-flex mr-2'>
          {statusIcon}
        </div>
        <div className='flex-fill'>
          <h3 className={`${statusClass}`}>{title}</h3>
        </div>
      </div>
    </div>
  );
};

CategoryStatusTitle.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default CategoryStatusTitle;
