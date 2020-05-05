import React from 'react';

const Share = () => {
  const shareMessage = 'Find out what\'s allowed and restricted in your area during the COVID-19 lockdown.\nhttps://covidlockdown.org/';
  return (
    <div className='c19-share-section text-center mt-3'>
      <a
        className="c19-share-link facebook trigger-event"
        href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovidlockdown.org"
        target="_blank"
        rel="noreferrer noopener"
        data-action="click"
        data-category="lockdown-handbook"
        data-label="share-facebook"
      >
        <span className='d-inline-block'><i className='fab fa-facebook-square fa-2x' /></span>
      </a>
      <a
        className="c19-share-link twitter trigger-event"
        href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(shareMessage)}`}
        target="_blank"
        rel="noreferrer noopener"
        data-action="click"
        data-category="lockdown-handbook"
        data-label="share-twitter"
      >
        <span className='d-inline-block mx-3'><i className='fab fa-twitter-square fa-2x' /></span>
      </a>
      <a
        className="c19-share-link whatsapp trigger-event"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
        target="_blank"
        rel="noreferrer noopener"
        data-action="click"
        data-category="lockdown-handbook"
        data-label="share-whatsapp"
      >
        <span className='d-inline-block'><i className='fab fa-whatsapp-square fa-2x' /></span>
      </a>
    </div>
  );
};

export default Share;
