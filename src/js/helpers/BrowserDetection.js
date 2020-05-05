export const getOS = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  let os = null;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(ua)) os = "Windows Phone";
  if (ua.indexOf("Win") !== -1) os = "Windows";
  if (ua.indexOf("Mac") !== -1) os = "Mac";
  if (ua.indexOf("Linux") !== -1) os = "Linux";
  if (ua.indexOf("Android") !== -1) os = "Android";
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod|like Mac/.test(ua) && !window.MSStream) os = 'iOS';

  return os;
};

/* https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769 */
export const getBrowser = () => {
  // Opera 8.0+
  if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
    return 'Opera';
  }

  // Firefox 1.0+
  if (typeof InstallTrigger !== 'undefined') {
    return 'Firefox';
  }

  // Safari 3.0+ "[object HTMLElementConstructor]"
  if (/constructor/i.test(window.HTMLElement) ||
    (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] ||
    (typeof safari !== 'undefined' && safari.pushNotification))) {
    return 'Safari';
  }

  // Internet Explorer 6-11
  let isIE = /*@cc_on!@*/false || !!document.documentMode
  if (isIE)
    return 'IE';

  // Edge 20+
  if (!isIE && !!window.StyleMedia) {
    return 'Edge';
  }

  if (!!window.chrome && !!window.chrome.webstore) {
    return 'Chrome';
  }

  return null;
};
