import { find } from 'lodash';

const categoryIconMapping = [
  {
    iconName: 'tools',
    category: 'construction',
  },
  {
    iconName: 'industry',
    category: 'construction___industrial',
  },
  {
    iconName: 'book-reader',
    category: 'education',
  },
  {
    iconName: 'concierge-bell',
    category: 'hospitality',
  },
  {
    iconName: 'industry',
    category: 'misc',
  },
  {
    iconName: 'car',
    category: 'movement',
  },
  {
    iconName: 'user-friends',
    category: 'recreational_-_large_gathering',
  },
  {
    iconName: 'user',
    category: 'recreational_-_small_gathering',
  },
  {
    iconName: 'bus',
    category: 'travel_-_public',
  },
  {
    iconName: 'industry',
    category: 'industrial_activity',
  },
  {
    iconName: 'clinic-medical',
    category: 'health_care',
  },
  {
    iconName: 'people-carry',
    category: 'livelihood',
  },
  {
    iconName: 'envelope',
    category: 'mailing',
  },
  {
    iconName: 'shopping-cart',
    category: 'shopping__commerce',
  },
  {
    iconName: 'store',
    category: 'supply_chain',
  },
  {
    iconName: 'motorcycle',
    category: 'travel_-_private',
  },
  {
    iconName: 'spa',
    category: 'personal_grooming',
  },
];

const DEFAULT_ICON = { iconName: 'tag' };

export const getCategoryIcon = (category) => {
  const icon = find(categoryIconMapping, (iconData) => {
    return iconData.category.toLowerCase() === category.toLowerCase();
  }) || DEFAULT_ICON;
  return icon.iconName;
};
