//  DirectMonster.js
//  This software is licensed under the MIT License
//  https://github.com/lunametrics/directmonster/blob/master/LICENSE
//  For configuration help, and step-by-step instructions to activate cross-user
//  tracking or for implementation using Google Tag Manager, please visit:
//  URL
//  Otherwise, simply include this script above the GATC.
//  Copyright 2013 by LunaMetrics LLC
//  By: @notdanwilkerson
(function(_gaq, document, window, undefined) {
  window['_gaq'] = window._gaq || [];
  var custIdVar = _dm.i.id;
  var asstIdVar = _dm.i.assist;
  var custVarSet = !isNaN((custIdVar - 0) + (asstIdVar - 0)) === true ? true : false;
  var currUtmz = (document.cookie.split('__utmz=')[1] || '').split(';')[0];
  var referrer = (document.referrer.split(/https?:\/\/(www\.)?/)[2] || '').split(/\//g)[0];
  var startUtmb = (document.cookie.split('__utmb=')[1] || '').split(';')[0] || '';
  var toolbarStamp = (window.location.hash.split('&i=')[1] || '').split(/[&#?]/)[0];
  var cookieStamp = (document.cookie.split(/utma=.*?\./)[1] || '').split(/\.\d*\.\d*\.\d*;/)[0] || '';
  var _gaqFallback = setTimeout(function(){
    clearInterval(_gaqChecker);
    _gaq.push([refreshParams()]);
  }, 5000);
  var _gaqChecker = setInterval(function(startUtmb){
    if (startUtmb !== (document.cookie.split('__utmb=')[1] || '').split(';')[0] && document.cookie.indexOf('__utmz=') > -1) {
      _gaq.push([refreshParams()]);
      clearInterval(_gaqChecker);
      clearInterval(_gaqFallback);
    }
  }, 1, startUtmb);
  toolbarStamp !== cookieStamp && toolbarStamp !== '' && custVarSet ? _gaq.push(['_setCustomVar', asstIdVar, 'Assisting-ID', toolbarStamp.toString(), 2]) : '';
  var loadHash = window.location.hash;
  _gaq.push(['determineReferrer', determineReferrer(referrer, toolbarStamp, cookieStamp)]);

  function determineReferrer(referrer, toolbarStamp, cookieStamp) {
    if (referrer === '' && toolbarStamp !== cookieStamp && toolbarStamp !== '') {
      decodeStoredParameters(loadHash, translate);
    }
  }

  function refreshParams() {
    var utmzCookie = document.cookie.split('__utmz=')[1].split(';')[0].replace(/\d+\.\d+\.\d+\.\d+\./, '').split('|');
    var cookieObject = {};
    var newCookieStamp = (document.cookie.split(/utma=.*?\./)[1] || '').split(/\.\d*\.\d*\.\d*;/)[0] || '';
    for(k = 0; k < utmzCookie.length; k++) {
      cookieObject[utmzCookie[k].split('=')[0]] = utmzCookie[k].split('=')[1];
    }
    var s = typeof cookieObject.utmcsr !== 'undefined' ? '#s=' + translate(cookieObject.utmcsr, 'encode') : '';
    var g = typeof cookieObject.utmgclid !== 'undefined' ? '#g=' + translate(cookieObject.utmgclid, 'encode') : '';
    var d = typeof cookieObject.utmgdclid !== 'undefined' ? '#d=' + translate(cookieObject.utmdclid, 'encode') : '';
    var m = typeof cookieObject.utmcmd !== 'undefined' ? '&m=' + translate(cookieObject.utmcmd, 'encode') : '';
    var c = typeof cookieObject.utmccn !== 'undefined' ? '&c=' + translate(cookieObject.utmccn, 'encode') : '';
    var t = typeof cookieObject.utmctr !== 'undefined' ?'&t=' + translate(cookieObject.utmctr, 'encode') : '';
    var o = typeof cookieObject.utmcct !== 'undefined' ? '&o=' + (cookieObject.utmcct.indexOf('-slb') > -1 ? translate(cookieObject.utmcct, 'encode') : translate(cookieObject.utmcct + '-slb', 'encode')): '&o=' + translate('-slb', 'encode');
    var i = '&i=' + newCookieStamp;
    document.location.search.search(/\?(utm_source=|gclid=|dclid=)/) === -1 ? document.location.hash = s + g + d + m + c + t + o + i : '';
    custVarSet ? window._gaq.push(['_setCustomVar', custIdVar, 'ID', newCookieStamp.toString(), 1], ['_trackEvent', 'Piggyback Event', 'Set ID', newCookieStamp.toString(), 0, true]) : '';
  }

  function decodeStoredParameters(loadHash, translate) {
    var s = (loadHash.split('#s=')[1] || '').split(/&/)[0].length > 0 ? '#utm_source=' + translate((loadHash.split('#s=')[1] || '').split(/&/)[0], 'decode') : '';
    var g = (loadHash.split('#g=')[1] || '').split(/&/)[0].length > 0 ? '#gclid=' + translate((loadHash.split('#g=')[1] || '').split(/&/)[0], 'decode') : '';
    var d = (loadHash.split('#d=')[1] || '').split(/&/)[0].length > 0 ? '#dclid=' + translate((loadHash.split('#d=')[1] || '').split(/&/)[0], 'decode') : '';
    var m = (loadHash.split('&m=')[1] || '').split(/&/)[0].length > 0 ? '&utm_medium=' + translate((loadHash.split('&m=')[1] || '').split(/&/)[0], 'decode') : '';
    var c = (loadHash.split('&c=')[1] || '').split(/&/)[0].length > 0 ? '&utm_campaign=' + translate((loadHash.split('&c=')[1] || '').split(/&/)[0], 'decode') : '';
    var t = (loadHash.split('&t=')[1] || '').split(/&/)[0].length > 0 ? '&utm_term=' + translate((loadHash.split('&t=')[1] || '').split(/&/)[0], 'decode') : '';
    var o = (loadHash.split('&o=')[1] || '').split(/&/)[0].length > 0 ? '&utm_content=' + translate((loadHash.split('&o=')[1] || '').split(/&/)[0], 'decode') : '';
    var i = '&i=' + toolbarStamp;
    window.location.hash = s + g + d + m + c + t + o + i;
  }

  function translate(term, type) {
    var typE = type === 'encode' ? 1 : 0;
    var ciph = ['o:organic', 'd:(direct)','n:(none)','c:cpc','r:referral','e:email','g:google','b:bing','y:yahoo','a:ask','l:aol','m:comcast','v:avg','gu:plus.url.google.com','gp:plus.google.com','t:t.co','p:pinterest.com','mp:m.pinterest.com','f:facebook.com','fm:m.facebook.com','yt:youtube.com','ym:m.youtube.com','li:linkedin.com','lm:m.linkedin.com','ns:(not set)','np:(not%20provided)'];
    for (i = 0; i < ciph.length; i++) {
      if (ciph[i].split(':')[typE] === term) {
        return ciph[i].split(':')[(typE + 1) % 2];
      }
    }
    var termChars = term.split('');
    var returnStr = [];
    for (j = 0; j < termChars.length; j++) {
      var currChar = termChars[j].charCodeAt(0);
      currChar >= 97 && currChar <= 122 ? (currChar + (2 * Math.pow(-1,typE + 1)) > 122 || currChar + (2 * Math.pow(-1,typE + 1)) < 97 ? returnStr.push(String.fromCharCode([123 - (97 - (currChar + (2 * Math.pow(-1,typE +1)))),(currChar + (2 * Math.pow(-1,typE + 1)) - 122) + 96][typE])) : returnStr.push(String.fromCharCode(currChar + (2 * Math.pow(-1, typE + 1))))) : '';
      currChar >= 65 && currChar <= 90 ? (currChar + (2 * Math.pow(-1,typE + 1)) > 90 || currChar + (2 * Math.pow(-1,typE + 1)) < 65 ? returnStr.push(String.fromCharCode([91 - (65 - (currChar + (2 * Math.pow(-1,typE +1)))),(currChar + (2 * Math.pow(-1,typE + 1)) - 90) + 64][typE])) : returnStr.push(String.fromCharCode(currChar + (2 * Math.pow(-1, typE + 1))))) : '';
      currChar < 65 || currChar > 90 && currChar < 97 || currChar > 122 ? returnStr.push(String.fromCharCode(currChar)) : '';
    }
    var finalWord = returnStr.join('');
    return finalWord;
  }
})(window._gaq, document, window);