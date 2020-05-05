import React from 'react';

const Share = () => {
  const whatsappMessage =
    'Find out what\'s allowed and restricted in your area during the COVID-19 lockdown.\nhttps://covidlockdown.org/';
  return (
    <div className='c19-share-section text-center mt-3'>
      <a className="c19-share-link facebook" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovidlockdown.org" target="_blank" rel="noreferrer noopener">
        <span className='d-inline-block'><i className='fab fa-facebook-square fa-2x' /></span>
      </a>
      <a className="c19-share-link twitter" href="https://twitter.com/intent/tweet/?text=Find%20out%20what's%20allowed%20and%20restricted%20in%20your%20area%20during%20the%20COVID-19%20lockdown.&url=https%3A%2F%2Fcovidlockdown.org" target="_blank" rel="noreferrer noopener">
        <span className='d-inline-block mx-3'><i className='fab fa-twitter-square fa-2x' /></span>
      </a>
      <a
        className="c19-share-link whatsapp"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span className='d-inline-block'><i className='fab fa-whatsapp-square fa-2x' /></span>
      </a>
    </div>
  );
};

export default Share;
