import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { dataCleaner } from '../data/dataCleaner';

import StatusTile from './StatusTile';
import CategoryStatusTitle from './CategoryStatusTitle';
import AccordionToggleIcon from './AccordionToggleIcon';

const CategoryCards = (props) => {
  const { activities } = props;

  if (activities && activities.length === 0) {
    return null;
  }

  const groupedActivities = _.groupBy(dataCleaner(_.sortBy(activities, ['activity_category'])), 'activity_category');
  // activity_sub_category
  const items = [];

  const renderItems = () => {
    for (const activityName in groupedActivities) {
      const activityList = groupedActivities[activityName];
      const idAttribute = activityName.replace(/(\s+|\/)/g, '_');
      const allowedActivities = _.filter(activityList, ['allowed', true]);
      const notAllowedActivities = _.filter(activityList, ['allowed', false]);
      const header = (
        <div className="card-header" id={`headingOne-${idAttribute}`}>
          <div className="accordion-title-link" type="button" data-toggle="collapse" data-target={`#collapseOne-${idAttribute}`} aria-expanded="true" aria-controls="collapseOne">
            <span>{activityName}</span>
            <div className='arrow-down'>
              <AccordionToggleIcon />
            </div>
          </div>
        </div>
      );
      let allowedList = null;
      if (allowedActivities && allowedActivities.length > 1) {
        allowedList = (
          <div className='c19-status-section'>
            <CategoryStatusTitle status='allowed' title='Allowed' />
            <div className='card-group'>
              {
                _.map(allowedActivities, (activity) => {
                  return (
                    <StatusTile status='allowed' title={activity.activity_sub_category} description={activity.details} />
                  );
                })
              }
            </div>
          </div>
        );
      }

      let notAllowedList = null;
      if (notAllowedActivities && notAllowedActivities.length > 1) {
        notAllowedList = (
          <div className='c19-status-section'>
            <CategoryStatusTitle status='restricted' title='Restricted' />
            <div className='card-group'>
              {_.map(notAllowedActivities, (activity) => {
                return (
                  <StatusTile status='notallowed' title={activity.activity_sub_category} description={activity.details} />
                );
              })
            }
            </div>
          </div>
        );
      }

      if (allowedList || notAllowedList) {
        items.push(
          <div className="card accordion-category-header" id={idAttribute}>
            {header}
            <div id={`collapseOne-${idAttribute}`} className="collapse show" aria-labelledby={`headingOne-${idAttribute}`} data-parent="#category-accordion">
              <div className="card-body">
                {allowedList}
                {notAllowedList}
              </div>
            </div>
          </div>
        );
      }
    }
    return items;
  };

  return (
    <div className="accordion" id="category-accordion">
      {
        renderItems()
      }
    </div>
  );
};

CategoryCards.defaultProps = {
  activities: null,
};

CategoryCards.propTypes = {
  activities: PropTypes.array,
};

export default CategoryCards;