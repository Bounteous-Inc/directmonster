//************************************************//
//*                   .... ....                  *//
//*                  |    v o  |                 *//
//*                **\__o_^____/**               *//
//*            ***********************           *//
//*          ***_*.*.*.*.*.*.*.*.*.*_***         *//
//*          ***\0000000000000000000/***         *//
//*           ***\00000000000000000/***          *//
//*            ***\000000000000000/***           *//
//*               ***\0.0.0.0.0/***              *//
//*                 *************                *//
//*                                              *//
//*               directmonster.js               *//
//*                                              *//
//***************By LunaMetrics LLC***************//
//********** http://www.lunametrics.com/ *********//
//***********************&************************//
//*********Dan Wilkerson * @notdanwilkerson*******//
//************version 1.3.3 August 2013***********//

//In order for this script to function properly, it needs to be placed above the GA tracking code
//This version of DirectMonster works with the asynchronous code.

//This software is licensed under the MIT License
//https://github.com/lunametrics/directmonster/blob/master/LICENSE


var strungCookies = document.cookie.replace(/ /g, '+').toString().split(';');          //Let's break up the cookies on the document and replace all the spaces with '+' signs
var getReferrer  = '';
if (document.referrer !== '') {    //Check if we have referrer information
    getReferrer = document.referrer.replace('www.', '').split(/:\/\//)[1].split('/')[0];  //Let's cut up whatever referrer information we have into something usable
}

var currTimeStInURL = parseInt(window.location.hash.split('&ts=')[1], 10);    //Grabs stored timestamp in the url, if there is one
if (isNaN(currTimeStInURL) === true) {
    currTimeStInURL = 0;
}

var source = '';
var medium = '';
var campaign = '';
var content = '';
var term = '';
var parameters = '';
var referredParameters = '';
var timestamp = '';
var gclid = '';
var dclid = '';
var gclidOrDclidOrSource = /\?dclid=|&dclid=|\?gclid=|&gclid=|\?utm_source=|&utm_source=/;
var directMonsterFired = false;    //Used later to ensure the function fires, even if it 'misses' the _trackPageview
var _gaq = _gaq || [];    //Establishes _gaq for functions directmonster.js pushes into it. Doesn't affect GA code
_gaq.push(['_setAllowAnchor', true]);    //Ensures that setAllowAnchor is 'true' so that anchored campaign parameters will be processed

function StringInArraySplit(haystack, needle, splitter) {    //Matches a string within a string in the array and then returns it as an array split by the splitter
    var i = 0;
    for (i = 0; i < haystack.length; i++) {
        if (haystack[i].match(needle)) {
            return haystack[i].split(splitter);
        }
    }
}

var pvCounterOnLanding = parseInt(new StringInArraySplit(strungCookies, 'utmb=', /\./g)[1], 10);
if (isNaN(pvCounterOnLanding) === true) {
    pvCounterOnLanding = 0;
    if (document.cookie.indexOf('utmb=') > -1) {
        cookieNoCounter = true;
    }
}

var sessionTS = parseInt(new StringInArraySplit(strungCookies, 'utmb=', /\./g)[3], 10);

function demixed(paramEncodes) {    //This function decodes campaign parameter information
    var reduxBits = '';
    var newChar = '';
    var i = '';
    var splitBits = paramEncodes.split('');
    switch (paramEncodes) {
    case 'd':
        reduxBits = '(direct)';
        break;
    case "r":
        reduxBits = 'referral';
        break;
    case 'g':
        reduxBits = 'google';
        break;
    case 'o':
        reduxBits = 'organic';
        break;
    case 'or':
        reduxBits = '(organic)';
        break;
    case 'ya':
        reduxBits = 'yahoo';
        break;
    case 'b':
        reduxBits = 'bing';
        break;
    case 'f':
        reduxBits = 'facebook.com';
        break;
    case 'fm':
        reduxBits = 'm.facebook.com';
        break;
    case 'tw':
        reduxBits = 'twitter.com';
        break;
    case 'l':
        reduxBits = 'linkedin.com';
        break;
    case 'y':
        reduxBits = 'youtube.com';
        break;
    case 'ym':
        reduxBits = 'm.youtube.com';
        break;
    case 't':
        reduxBits = 't.co';
        break;
    case 'so':
        reduxBits = 'stackoverflow.com';
        break;
    case 'p':
        reduxBits = 'pinterest.com';
        break;
    case 'gu':
        reduxBits = 'plus.google.com';
        break;
    case 'gp':
        reduxBits = 'plus.url.google.com';
        break;
    case 'n':
        reduxBits = '(none)';
        break;
    case 'ns':
        reduxBits = '(not set)';
        break;
    case 'np':
        reduxBits = '(not provided)';
        break;
    case 'c':
        reduxBits = 'cpc';
        break;
    default:
        for (i = 0; i < paramEncodes.length; i++) {
            if (splitBits[i].search(/[A-Za-z]+/) > -1) {
                switch (splitBits[i].charCodeAt(0)) {
                case 65:
                    newChar = 'Z';
                    break;
                case 97:
                    newChar = 'z';
                    break;
                default:
                    newChar = splitBits[i].charCodeAt(0) - 1;
                    break;
                }
                reduxBits += String.fromCharCode(newChar);
            } else {
                reduxBits += splitBits[i];
            }
        }
        break;
    }
    return reduxBits;
}

function remixed(paramBits) {    //This function encodes campaign parameter information
    var reduxBits = '';
    var newChar = '';
    var i = '';
    var splitBits = paramBits.split('');
    switch (paramBits) {
    case '(direct)':
        reduxBits = 'd';
        break;
    case "referral":
        reduxBits = 'r';
        break;
    case 'google':
        reduxBits = 'g';
        break;
    case 'organic':
        reduxBits = 'o';
        break;
    case '(organic)':
        reduxBits = 'or';
        break;
    case 'yahoo':
        reduxBits = 'ya';
        break;
    case 'bing':
        reduxBits = 'b';
        break;
    case 'facebook.com':
        reduxBits = 'f';
        break;
    case 'm.facebook.com':
        reduxBits = 'fm';
        break;
    case 'twitter.com':
        reduxBits = 'tw';
        break;
    case 'linkedin.com':
        reduxBits = 'l';
        break;
    case 'youtube.com':
        reduxBits = 'y';
        break;
    case 'm.youtube.com':
        reduxBits = 'ym';
        break;
    case 't.co':
        reduxBits = 't';
        break;
    case 'stackoverflow.com':
        reduxBits = 'so';
        break;
    case 'pinterest.com':
        reduxBits = 'p';
        break;
    case 'plus.google.com':
        reduxBits = 'gu';
        break;
    case 'plus.url.google.com':
        reduxBits = 'gp';
        break;
    case '(none)':
        reduxBits = 'n';
        break;
    case '(not set)':
        reduxBits = 'ns';
        break;
    case '(not provided)':
        reduxBits = 'np';
        break;
    case 'cpc':
        reduxBits = 'c';
        break;
    default:
        for (i = 0; i < splitBits.length; i++) {
            if (splitBits[i].search(/[A-Za-z]+/) > -1) {
                switch (splitBits[i].charCodeAt(0)) {
                case 90:
                    newChar = 'A';
                    break;
                case 122:
                    newChar = 'a';
                    break;
                default:
                    newChar = splitBits[i].charCodeAt(0) + 1;
                    break;
                }
                reduxBits += String.fromCharCode(newChar);
            } else {
                reduxBits += splitBits[i];
            }
        }
        break;
    }
    return reduxBits;
}

function slbDecode() {    //This function decodes encoded parameters stored in the URL
	if (window.location.hash.indexOf('g=') > -1) {
        gclid = 'gclid=' + demixed(window.location.hash.split('g=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
    }
    if (window.location.hash.indexOf('d=') > -1) {
        dclid = 'dclid=' + demixed(window.location.hash.split('d=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
    }
    if (window.location.hash.indexOf('sr=') > -1) {
        source = 'utm_source=' + demixed(window.location.hash.split('sr=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
    }
    if (window.location.hash.indexOf('m=') > -1) {
        medium = '&utm_medium=' + demixed(window.location.hash.split('m=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
    }
    if (window.location.hash.indexOf('cp=') > -1) {
        campaign = '&utm_campaign=' + demixed(window.location.hash.split('cp=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
    }
    if (window.location.hash.indexOf('ct=') > -1) {
        content = '&utm_content=' + demixed(window.location.hash.split('ct=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
	} else {
        content = '&utm_content=-slb';
	}
    if (window.location.hash.indexOf('st=') > -1) {
        term = '&utm_term=' + demixed(window.location.hash.split('st=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0]);
    }
	if (isNaN(window.location.hash.split('&ts=')[1]) === true){
		timestamp = '&ts=0';
	} else {
		timestamp = '&ts=' + window.location.hash.split('&ts=')[1];
	}
    var fixedHash = dclid + gclid + source + medium + campaign + term + content + timestamp;
    window.location.hash = fixedHash;
}

function correctContentCheck() {    //This function is to a fallback ensure correct campaign information on a shared visit
	if (window.location.hash.indexOf('utm_content') > -1) {
	    var checkContent = window.location.hash.split('&utm_content=')[1].split(/&m=|&cp=|&ct=|&st=|&ts=/)[0];    //Is there already a utm_content parameter?
		if (checkContent.indexOf('-slb') === -1) {
		    var fixedHash = window.location.hash.split('&utm_content=')[0] + '&utm_content=' + checkContent + window.location.hash.substring(window.location.hash.indexOf('&utm_content=') + checkContent.length + 13);
			window.location.hash = fixedHash;
		}
	} else {
		var fixedHash = window.location.hash + '&utm_content=-slb';
		window.location.hash = fixedHash;
	}
}

function referrerNoGo() {    //This function is to determine what to do with stored URL parameters if there is no referral information
    if (currTimeStInURL !== parseInt(new StringInArraySplit(strungCookies, 'utma=', /\./g)[2], 10)) {    //Current timestamp doesn't match the one in the URL
		var decodedHashedParamIndicators = /#utm_gclid=|#utm_dclid=|#utm_source=/;
	    if (window.location.href.search(decodedHashedParamIndicators) > -1) {     //Are the parameters decoded?
			correctContentCheck();
		} else {
		    slbDecode();    //decode those params
		}	
	}
}

function checkForHashedParamsFunc() {
	var checkForHashedParams = /#sr=|#g=|#d=|#dclid=|#gclid=|#utm_source=/;
    if (window.location.hash.search(checkForHashedParams) > -1 && getReferrer === '') {
        referrerNoGo();
    }
}

_gaq.push([checkForHashedParamsFunc()]);

function directMonster() {
    strungCookies = document.cookie.replace(/ /g, '+').toString().split(';');    //Get new cookie variables now that GA has fired
    var getUTMZ = new StringInArraySplit(strungCookies, 'utmz', /[\|,\.]/g);
    timestamp = '&ts=' + new StringInArraySplit(strungCookies, 'utma=', /\./g)[2];
    var i = 0;
    for (i = 0; i < getUTMZ.length; i++) {    //Finds each campaign parameter in the cookie and assigns it to the appropriate variable
        if (getUTMZ[i].indexOf('utmgclid') > -1 || getUTMZ[i].indexOf('utmdclid') > -1) {
            if (getUTMZ[i].indexOf('utmgclid') > -1) {
                gclid = "g=" + remixed(getUTMZ[i].split('=')[1]);
            }
            if (getUTMZ[i].indexOf('utmdclid') > -1) {
                dclid = "d=" + remixed(getUTMZ[i].split('=')[1]);
            }
            for (i = 0; i < getUTMZ.length; i++) {
                if (getUTMZ[i].indexOf('utmcct') > -1) {
                    if (getUTMZ[i].indexOf('-slb') > -1) {
                        content = '&ct=' + remixed(getUTMZ[i].split('=')[1]);
                    } else if (getUTMZ[i].indexOf('-slb') === -1) {
                        content = '&ct=' + remixed(getUTMZ[i].split('=')[1] + '-slb');
                    }
                }
                if (getUTMZ[i].indexOf('utmctr') > -1) {
                    term = '&st=' + remixed(getUTMZ[i].split('=')[1]);
                }
            }
        } else {
            if (getUTMZ[i].indexOf('utmcsr') > -1) {
                source = 'sr=' + remixed(document.cookie.toString().split('utmcsr=')[1].split('|')[0]); //Ensures the entire referrer is saved, including TLDs.
            } else if (getUTMZ[i].indexOf('utmcmd') > -1) {
                medium = '&m=' + remixed(getUTMZ[i].split('=')[1]);
            } else if (getUTMZ[i].indexOf('utmccn') > -1) {
                campaign = '&cp=' + remixed(getUTMZ[i].split('=')[1]);
            } else if (getUTMZ[i].indexOf('utmctr') > -1) {
                term = '&st=' + remixed(getUTMZ[i].split('=')[1]);
            } else if (getUTMZ[i].indexOf('utmcct') > -1) {
                if (getUTMZ[i].indexOf('-slb') > -1) {
                    content = '&ct=' + remixed(getUTMZ[i].split('=')[1]);
                } else if (getUTMZ[i].indexOf('-slb') === -1) {
                    content = '&ct=' + remixed(getUTMZ[i].split('=')[1] + '-slb');
                }
            } else if (getUTMZ[i].indexOf('utmcct') === -1) {
                content = '&ct=' + remixed('-slb');
            }
        }
    }
    if (window.location.href.search(gclidOrDclidOrSource) === -1) {    //if the URL has campaign parameters or a dclid/gclid, do nothing. The visitor will already share relevant info if they copy the URL
        parameters = dclid + gclid + source + medium + campaign + content + term + timestamp;    //If there's no gclid, append everything
        window.location.hash = parameters;    //Add the parameters after the anchor
    }
}

function directChecker() {
    var pvCounterRefreshed = parseInt(new StringInArraySplit((document.cookie.replace(/ /g, '+').toString().split(';')), 'utmb=', /\./g)[1], 10);
    var sessionTSRefreshed = parseInt(new StringInArraySplit((document.cookie.replace(/ /g, '+').toString().split(';')), 'utmb=', /\./g)[3], 10);
    if (isNaN(pvCounterRefreshed) === false) {
        if (pvCounterOnLanding !== pvCounterRefreshed || (sessionTSRefreshed - sessionTS) > 0) {
			_gaq.push([directMonster()]);
            clearInterval(startItUp);
            directMonsterFired = true;
        }
    }
}

var startItUp = setInterval(directChecker, 1);

function directMonsterCatch() {
    if (directMonsterFired === false) {
        clearInterval(startItUp);
        window.onload = _gaq.push([directMonster()]);
    }
}

var shutItDown = setTimeout(directMonsterCatch, 10000);
