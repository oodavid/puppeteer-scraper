exports.domain = 'www.checkatrade.com';
exports.seedUrls = getSeedUrls();
exports.parse = parse;
exports.getUrlWeight = getUrlWeight;


// Return an array of initial Urls to parse
function getSeedUrls(){
    return [
      'http://www.checkatrade.com/',
      'http://www.checkatrade.com/JamesPond/',
      'http://www.checkatrade.com/JamesPond/Reviews.aspx',
      'http://www.checkatrade.com/JamesPond/Gallery.aspx',
      'http://www.checkatrade.com/JamesPond/Services.aspx',
      'http://www.checkatrade.com/JamesPond/Checks.aspx',
    ];
};

// Parse the page, returning data
async function parse(page, urlObject){
  const data = await page.evaluate(function(){
    var $ = window.$ || window.jQuery;
    // Blank data
    var data = {};
    // The "id" is simply the first part of the Url, ie: /BusinessName/Services = "BusinessName"
    var m = location.pathname.match(/^\/([^\/]*)\//i);
    var id = m ? m[1] : false;
    if(id){
        data.id = id;
        // Rip out every property from the contact card
        $('.contact-card [itemprop]').each(function(){
          var prop = $(this).attr('itemprop');
          // Ignore these wrapper elements
          if($.inArray(prop, ['aggregateRating']) !== -1){ return true; }
          // Values come in different forms
          var value;
          switch(prop){
            // Rating
            case "ratingValue": value = parseFloat($(this).text(), 10); break;
            case "reviewCount": value = parseInt($(this).text()); break;
            case "worstRating": value = parseInt($(this).attr('content')); break;
            case "bestRating":  value = parseInt($(this).attr('content')); break;
            // By default grab the content
            default: value = $.trim($(this).text()); break;
          }
          // Add to the data, duplicate keys should create arrays (ie: telephone)
          if(data[prop] && !Array.isArray(data[prop])){
            data[prop] = [ data[prop] ];
          }
          if(Array.isArray(data[prop])){
            data[prop].push(value);
          } else {
            data[prop] = value;
          }
        });
        // Can we see the company id?
        var companyId = $('[data-company-id]');
        if(companyId.length){
          data.checkatradeId = parseInt(companyId.attr('data-company-id'));
        }
        // Some pages have a well-formatted "company" object, we'll have that
        if(window.cat && window.cat.dataHeaderData && window.cat.dataHeaderData.Companies.length){
          data.company = window.cat.dataHeaderData.Companies[0];
        }
        // Checks - I think they really just mean "checks" here, not "checksum" - how silly.
        var checks = $('.member-checksum li');
        if(checks.length){
          data.checks = [];
          checks.each(function(){
            data.checks.push($.trim($(this).text()));
          });
        }
        // Skills
        var skills = $('.skills-list > li');
        if(skills.length){
          data.skills = {};
          skills.each(function(){
            var heading = $.trim($(this).find('> span').text());
            data.skills[heading] = [];
            $(this).find('li').each(function(){
              data.skills[heading].push($.trim($(this).text()));
            });
          });
        }
        // Services
        var services = $('.member-services__serv-list > div');
        if(services.length){
          data.services = [];
          services.each(function(){
            data.services.push($.trim($(this).text()));
          });
        }
        // Map
        // http://www.checkatrade.com/BandKElectricalsLtd/Checks.aspx
        //   VAT Number
        //   Company Name
        //   Company ID
        //   Director
    }
    return data;
  });
  return data;
}


// Return the "weight" of an URL from 0-1
function getUrlWeight(url){
  var weights = {
    '/Account/': 0,       // Customer Sign-In
    '/Report.aspx': 0,    // Printable report
    '/GiveFeedback/': 0,  // Give feedback about a member
    '/Search/': 0.1,      // Good for building the network, but I think there are infinite search variations exposed
    '/Gallery.aspx': 0.3, // Just photos of the member's work
    '/Reviews.aspx': 0.4, // Reviews about the member
    '/Reputation': 0.2    // Can't remember why I downgraded this...
  };
  // See if we can match it
  for(var key in weights){
    if(weights.hasOwnProperty(key)){
      if(url.indexOf(key) !== -1){
        return weights[key];
      }
    }
  }
  // Everything else is top priority
  return 1;
};
