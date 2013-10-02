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
//*             directmonster2.0.2.js            *//
//*                                              *//
//***************By LunaMetrics LLC***************//
//********** http://www.lunametrics.com/ *********//
//***********************&************************//
//*********Dan Wilkerson * @notdanwilkerson*******//
//************version 2.0.2 September 2013********//

//This software is licensed under the MIT License
//https://github.com/lunametrics/directmonster/blob/master/LICENSE

//VARIABLES
var source = '';        //Document referrer unless overruled
var medium = '';        //Referral by default unless overruled
var campaign = '';        //set by campaign paramters or from overruled
var term = '';        //Comes from relevant query parameter or overruled
var content = '';        //everything after the hostname in the referrer. MAybe find with TLDs?
var gclid = '';
var dclid = '';
var URLnewHash = '';

var i = '';
var getReferrer    = '';
var foundSearchEngine = false;
var ownedHostnames = document.location.hostname.replace('www','');        //Domain names you own to prevent self-referrals, can be a RegEx
if (document.referrer !== '') {        //Check if we have referrer information
    getReferrer = document.referrer.replace('www.', '').split(/:\/\//)[1].split('/')[0];    //Let's cut up whatever referrer information we have into something usable
}
var enginesAndQueryParams = "daum:q= eniro:search_word= naver:query= pchome:q= images.google:q= google:q= yahoo:p= yahoo:q= msn:q= bing:q= aol:query= aol:q= lycos:q= lycos:query= ask:q= netscape:query= cnn:query= about:terms= mamma:q= voila:rdata= virgilio:qs= live:q= baidu:wd= alice:qs= yandex:text= najdi:q= seznam:q= rakuten:qt= biglobe:q= goo.ne:MT= wp:szukaj= onet:qt= yam:k= kvasir:q= ozu:q= terra:query= rambler:query= conduit:q= babylon:q= search-results:q= avg:q= comcast:q= incredimail:q= startsiden:q= go.mail.ru:q= search.centrum.cz:q= 360.cn:q=".split(" ");

var urlRefc = '';
if (document.location.href.indexOf('&rf=') > -1) {
    urlRefc = document.location.href.split('&rf=')[1].split(/&/)[0];
}
var cookieC = '';
if (document.cookie.indexOf('_ga=') > -1) {
    cookieC = document.cookie.toString().split('_ga=')[1].split(';')[0].split(/GA[0-9]\.[0-9]\./)[1];
}


//ENCODE/CIPHER & DECODE/DECIPHYER FUNCTIONS
function remixed(paramBits) {        //This function encodes campaign parameter information
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

function demixed(paramEncodes) {        //This function decodes campaign parameter information
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

//FUNCTIONS
function preMonster() {
    if (document.referrer === '' && window.location.hash.search(/(\?|&|#)(utm_source|dclid|gclid)=/) === -1 && cookieC !== urlRefc) {
        var pmGclid = '';
        var pmDclid = '';
        var pmSource = '';
        var pmMedium = '';
        var pmCampaign = '';
        var pmContent = '';
        var pmTerm = '';
        var pmRefcid = '';
        if (window.location.hash.indexOf('#g=') > -1) {
            pmGclid = 'gclid=' + demixed(window.location.hash.split('#g=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('#d=') > -1) {
            pmDclid = 'dclid=' + demixed(window.location.hash.split('#d=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('#sr=') > -1) {
            pmSource = 'utm_source=' + demixed(window.location.hash.split('#sr=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('&m=') > -1) {
            pmMedium = '&utm_medium=' + demixed(window.location.hash.split('&m=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('&cp=') > -1) {
            pmCampaign = '&utm_campaign=' + demixed(window.location.hash.split('&cp=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('&ct=') > -1) {
            pmContent = '&utm_content=' + demixed(window.location.hash.split('&ct=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('&st=') > -1) {
            pmTerm = '&utm_term=' + demixed(window.location.hash.split('&st=')[1].split(/&m=|&cp=|&ct=|&st=|&rf=/)[0]);
        }
        if (window.location.hash.indexOf('&rf=') > -1) {
            pmRefcid = '&rf=' + window.location.hash.split('&rf=')[1].split(/&m=|&cp=|&ct=|&st=/)[0];
        }
        var fixedHash = pmDclid + pmGclid + pmSource + pmMedium + pmCampaign + pmTerm + pmContent + pmRefcid;
        window.location.hash = fixedHash;
    }
    if (window.location.href.search(/#(utm_source|gclid|dclid)=/) > -1 && cookieC === urlRefc) {
        document.location.hash = '';
    }
}

function dirmonURL(theCID) {
    var urlSource = '';
    var urlMedium = '';
    var urlCampaign = '';
    var urlTerm = '';
    var urlContent = '';
    var urlGclid = '';
    var urlDclid = '';

    if (window.location.href.search(/(\?|&)(utm_source|dclid|gclid)=/) > -1) {
        window.location.hash = "&rf=" + theCID;
    } else {
        if (source.length > 0) {
            urlSource = "#sr=" +    remixed(source);
        }
        if (dclid.length > 0) {
            urlDclid = "#d=" + remixed(dclid);
        }
        if (gclid.length > 0) {
            urlGclid = "#g=" + remixed(gclid);
        }
        if (medium.length > 0) {
            urlMedium = "&m=" + remixed(medium);
        }
        if (campaign.length > 0) {
            urlCampaign = "&cp=" + remixed(campaign);
        }
        if (term.length > 0) {
            urlTerm = "&st=" + remixed(term);
        }
        if (content.length > 0) {
		    if (content.search(/-slb|-tmc/) > -1) {
                urlContent = "&ct=" + remixed(content);
			} else {
			   urlContent = "&ct=" + remixed(content + "-slb"); 
			}
        } else {
		    urlContent = '&ct=-tmc';
		}
        URLnewHash = urlSource + urlDclid + urlGclid + urlMedium + urlCampaign + urlTerm + urlContent + "&rf=" + theCID;
        window.location.hash = URLnewHash;
    }
}

function dirmonCookie() {
    var cookSource = '';
    var cookMedium = '';
    var cookCampaign = '';
    var cookTerm = '';
    var cookContent = '';
    var cookGclid = '';
    var cookDclid = '';

    if (source.length > 0) {
        cookSource = "ldmcsr=" + remixed(source);
    }
    if (dclid.length > 0) {
        cookDclid = "ldmdclid=" + remixed(dclid);
    }
    if (gclid.length > 0) {
        cookGclid = "ldmgclid=" + remixed(gclid);
    }
    if (medium.length > 0) {
        cookMedium = "|ldmcmd=" + remixed(medium);
    }
    if (campaign.length > 0) {
        cookCampaign = "|ldmccn=" + remixed(campaign);
    }
    if (term.length > 0) {
        cookTerm = "|ldmctr=" + remixed(term);
    }
    if (content.length > 0) {
        cookContent = "|ldmcct=" + remixed(content);
    }
    var cookieString = cookSource + cookDclid + cookGclid + cookMedium + cookCampaign + cookTerm + cookContent;
    var cookieExpires = new Date();
    cookieExpires.setMonth(cookieExpires.getMonth() + 6);
    var finalCookie = "utmzombie=" + cookieString + "; path=/; expires=" + cookieExpires;
    document.cookie = finalCookie;
}

function getBestInfo() {
    if (document.location.href.indexOf('?') > -1) {
        var queryParams = document.location.href.split('?')[1].split(/#/)[0].split(/&/g);
        for (i = 0; i < queryParams.length; i++) {
            if (queryParams[i].indexOf('gclid') > -1 || queryParams[i].indexOf('dclid') > -1) {
                if (queryParams[i].indexOf('gclid') > -1) {
                    gclid = queryParams[i].split('=')[1];
                }
                if (queryParams[i].indexOf('dclid') > -1) {
                    dclid = queryParams[i].split('=')[1];
                }
                if (document.referrer.indexOf('google.com') > -1) {    //check the referrer for the term
                    term = document.referrer.split(/&q=|\?q=|#q=/)[1].split(/&/)[0];
                } else if (document.location.href.indexOf('&st=') > -1) {    //check for a hashed parameter with the term
                    term = demixed(document.location.href.split('&st=')[1].split(/&/)[0]);
                } else {        //check the cookie for the term
                    if (document.cookie.indexOf('|ldmcct=') > -1) {
                        term = document.cookie.split('utmzombie')[1].split(';')[0].split(/utmctr=/)[1].split(/\|/)[0];
                    }
                }
            } else {
                if (queryParams[i].indexOf('utm_source=') > -1) {
                    source = queryParams[i].split('=')[1];
                } else if (queryParams[i].indexOf('utm_medium=') > -1) {
                    medium = queryParams[i].split('=')[1];
                } else if (queryParams[i].indexOf('utm_campaign=') > -1) {
                    campaign = queryParams[i].split('=')[1];
                } else if (queryParams[i].indexOf('utm_term=') > -1) {
                    term = queryParams[i].split('=')[1];
                } else if (queryParams[i].indexOf('utm_content=') > -1) {
                    content = queryParams[i].split('=')[1];
                }
            }
        }
    } else if (document.referrer !== '' && getReferrer.search(ownedHostNames) === -1) {
        for (i = 0; i < enginesAndQueryParams.length; i++) {
            if (document.referrer.indexOf(enginesAndQueryParams[i].split(':')[0]) > -1) {
                if (document.referrer.indexOf(enginesAndQueryParams[i].split(':')[1]) > -1) {
                    term = document.referrer.split(enginesAndQueryParams[i].split(':')[1])[1].split('&')[0];
                    if (term === '' && document.referrer.indexOf('google.com/') > -1) {
                        term = '(not%20provided)';
                    }
                    source = enginesAndQueryParams[i].split(':')[0];
                    medium = 'organic';
                    foundSearchEngine = true;
                } else if (document.referrer === 'https://www.google.com/') {
                    source = 'google';
                    medium = 'organic';
                    term = '(not%20provided)';
                    foundSearchEngine = true;
                }
            }
        }
        if (foundSearchEngine === false) {
            source = document.referrer.replace('www.', '').split(/:\/\//)[1].split('/')[0];
            medium = 'referral';
            content = document.referrer.split(getReferrer)[1].split(/\?|#/)[0];
            if (content === '/') {
                content = '';
            }
        }
    } else if (document.location.href.search(/#sr=|#d=|#g=/) > -1) {
        var hashedParams = document.location.hash.split(/&/g);
        for (i = 0; i < hashedParams.length; i++) {
            if (hashedParams[i].indexOf('#sr=') > -1) {
                source = demixed(hashedParams[i].split('=')[1]);
            }
            if (hashedParams[i].indexOf('#g=') > -1) {
                gclid = demixed(hashedParams[i].split('=')[1]);
            }
            if (hashedParams[i].indexOf('#d=') > -1) {
                dclid = demixed(hashedParams[i].split('=')[1]);
            }
            if (hashedParams[i].indexOf('m=') > -1) {
                medium = demixed(hashedParams[i].split('=')[1]);
            }
            if (hashedParams[i].indexOf('cp=') > -1) {
                campaign = demixed(hashedParams[i].split('=')[1]);
            }
            if (hashedParams[i].indexOf('st=') > -1) {
                term = demixed(hashedParams[i].split('=')[1]);
            }
            if (hashedParams[i].indexOf('ct=') > -1) {
                content = demixed(hashedParams[i].split('=')[1]);
            }
        }
    } else if (document.cookie.indexOf('utmzombie=') > -1) {
        var cookieBits = document.cookie.split('utmzombie=')[1].split(';')[0].split(/\|/);
        for (i = 0; i < cookieBits.length; i++) {
            if (cookieBits[i].indexOf('ldmcsr=') > -1) {
                source = demixed(cookieBits[i].split('=')[1]);
            }
            if (cookieBits[i].indexOf('ldmgclid=') > -1) {
                gclid = demixed(cookieBits[i].split('=')[1]);
            }
            if (cookieBits[i].indexOf('ldmdclid=') > -1) {
                dclid = demixed(cookieBits[i].split('=')[1]);
            }
            if (cookieBits[i].indexOf('ldmcmd=') > -1) {
                medium = demixed(cookieBits[i].split('=')[1]);
            }
            if (cookieBits[i].indexOf('ldmccn=') > -1) {
                campaign = demixed(cookieBits[i].split('=')[1]);
            }
            if (cookieBits[i].indexOf('ldmctr=') > -1) {
                term = demixed(cookieBits[i].split('=')[1]);
            }
            if (cookieBits[i].indexOf('ldmcct=') > -1) {
                content = demixed(cookieBits[i].split('=')[1]);
            }
        }
    }
    dirmonCookie();
}

getBestInfo();
