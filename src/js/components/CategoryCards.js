import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { dataCleaner } from '../data/dataCleaner';

import { getCategoryIcon } from '../helpers/CategoryHelpers';

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
          <div className={`${items.length === 0 ? '' : 'collapsed'} accordion-title-link`} data-toggle="collapse" data-target={`#collapseOne-${idAttribute}`} aria-expanded="true" aria-controls="collapseOne" data-action="click" data-category="lockdown-handbook" data-label={`category-accordion-${activityName}`}>
            <span className='d-inline-block mr-2'><i className={`fas fa-${getCategoryIcon(idAttribute)} fa-sm`} /></span>
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
          <div className='c19-status-section c19-allowed-list'>
            <CategoryStatusTitle status='allowed' title='Allowed' />
            <div className='row row-cols-1 row-cols-sm-3 no-gutters'>
              {
                _.map(allowedActivities, (activity) => {
                  return (
                    <div className='col mb-4'>
                      <StatusTile status='allowed' title={activity.activity_sub_category} description={activity.detail} />
                    </div>
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
          <div className='c19-status-section c19-restricted-list'>
            <CategoryStatusTitle status='restricted' title='Restricted' />
            <div className='row row-cols-1 row-cols-sm-3 no-gutters'>
              {_.map(notAllowedActivities, (activity) => {
                return (
                  <div className='col mb-4'>
                    <StatusTile status='allowed' title={activity.activity_sub_category} description={activity.detail} />
                  </div>
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
            <div id={`collapseOne-${idAttribute}`} className={`collapse ${items.length === 0 ? 'show' : ''}`} aria-labelledby={`headingOne-${idAttribute}`} data-parent="#category-accordion">
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
