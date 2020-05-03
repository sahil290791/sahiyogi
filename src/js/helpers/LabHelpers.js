import { chain } from 'lodash';

const REGEX = /(<([^>]+)>)/ig;

const stripHTML = (value) => {
  if (value) {
    return value.replace(REGEX, '');
  }
  return value;
};

export const getLabs = (identifier, value, labs) => {
  /*
  Available fields
    {
    address: "AIIMS Campus Rd, Saket Nagar, Habib Ganj, 462026 Bhopal, Madhya Pradesh , India",
    catid: 15,
    city: "Bhopal",
    country: "India",
    cutDescription: "All India Institute of Medical Sciences",
    date: "2020-03-23 03:54:04",
    description: "All India Institute of Medical Sciences (AIIMS) Madhya Pradesh 462026",
    id: 66,
    lat: 23.207355,
    lng: 77.457809,
    multimedia: "",
    readmore: "/index.php/15-government-laboratories/66-all-india-inst",
    state: "Madhya Pradesh ",
    street: "AIIMS Campus Rd, Saket Nagar, Habib Ganj",
    title: " All India Institute of Medical Sciences (AIIMS), Bhopal",
    zip: "462026"
    },
  */

  const labData = chain(labs)
    .filter((lab) => {
      return lab[identifier] && lab[identifier].toLowerCase() === value.toLowerCase();
    })
    .map((lab) => {
      return {
        ...lab,
        address: stripHTML(lab['address']),
        cutDescription: stripHTML(lab['cutDescription']),
        description: stripHTML(lab['description'])
      };
    })
    .value();
  // filter(labs, (lab) => {
  //   return lab[identifier] && lab[identifier].toLowerCase() === value.toLowerCase();
  // });
  return labData || {};
};
