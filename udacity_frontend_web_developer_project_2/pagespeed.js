/**
  * This function accepts a PS Insights JSON object and returns an
  *    array of the "ruleResults" string values.
  * @param {psinsights JSON object} results - The results of a PS Insights
  *    evaluation.
  * @return {array} - An array of the ruleResults strings.
*/
function ruleList(results) {
  var
    returnArr = []
    , i;

  // Iterate on the results.
  for (i in results.formattedResults.ruleResults) {
      // Append the results text to the array.
      returnArr.push(results.formattedResults.ruleResults[i].localizedRuleName);
  }

  // Return the array.
  return returnArr;
}

/**
  * This function accepts a PS Insights JSON object and returns an
  *    INT of the total bytes to load the website.
  * @param {psinsights JSON objct} results - The results of a PS Insights
  *    evaluation.
  * @return {int} - The total value of bytes required to load the website.
*/
function totalBytes(results) {
    var
      returnVal = 0
      , i;

    // Iterate on the page stats.
    for (i in results.pageStats) {
      // Add the value if it is a byte value.
      returnVal += getValueIfBytes(i, results.pageStats[i]);
    }

    // Return the total bytes.
    return returnVal;
}

/**
  * This function accepts a key and a value. If the key ends in the
  *    string "Bytes", it converts the value to an INT and returns it.
  *    If the key does not end in "Bytes", zero (0) is returned.
  * @param {string} key - The key to evaluate to determine if it refers to Bytes.
  * @param {string} value - The value to be converted to an INT if the key ends in "Bytes".
  * @return {int} - The value argument converted to an INT if the key ends in "Bytes".
  *    If the key does not end in "Bytes", zero (0) is returned.
*/
function getValueIfBytes(key, value) {
  // Check to see if the key ends in "Bytes".
    if (key.substr(-5, 5) === 'Bytes') {
      // Parse the value and return it.
      return parseInt(value, 10);
    } else {
      return 0;
    }
}

// Below, you'll find a sample PS Insights JSON
// and two console.log statements to help you test your code!

psinsights = {
 "kind": "pagespeedonline#result",
 "id": "/speed/pagespeed",
 "responseCode": 200,
 "title": "PageSpeed Home",
 "score": 90,
 "pageStats": {
  "numberResources": 22,
  "numberHosts": 7,
  "totalRequestBytes": "2761",
  "numberStaticResources": 16,
  "htmlResponseBytes": "91981",
  "cssResponseBytes": "37728",
  "imageResponseBytes": "13909",
  "javascriptResponseBytes": "247214",
  "otherResponseBytes": "8804",
  "numberJsResources": 6,
  "numberCssResources": 2
 },
 "formattedResults": {
  "locale": "en_US",
  "ruleResults": {
    "AvoidBadRequests": {
      "localizedRuleName": "Avoid bad requests",
      "ruleImpact": 0.0
    },
    "MinifyJavaScript": {
      "localizedRuleName": "Minify JavaScript",
      "ruleImpact": 0.1417,
      "urlBlocks": [
      {
        "header": {
       "format": "Minifying the following JavaScript resources could reduce their size by $1 ($2% reduction).",
       "args": [
        {
         "type": "BYTES",
         "value": "1.3KiB"
        },
        {
         "type": "INT_LITERAL",
         "value": "0"
        }
       ]
        },
        "urls": [
        {
          "result": {
         "format": "Minifying $1 could save $2 ($3% reduction).",
         "args": [
          {
           "type": "URL",
           "value": "http://code.google.com/js/codesite_tail.pack.04102009.js"
          },
          {
           "type": "BYTES",
           "value": "717B"
          },
          {
           "type": "INT_LITERAL",
           "value": "1"
          }
         ]
        }
       },
       {
        "result": {
         "format": "Minifying $1 could save $2 ($3% reduction).",
         "args": [
          {
           "type": "URL",
           "value": "http://www.gmodules.com/ig/proxy?url\u003dhttp%3A%2F%2Fjqueryjs.googlecode.com%2Ffiles%2Fjquery-1.2.6.min.js"
          },
          {
           "type": "BYTES",
           "value": "258B"
          },
          {
           "type": "INT_LITERAL",
           "value": "0"
          }
         ]
        }
       }
      ]
     }
    ]
   },
   "SpriteImages": {
    "localizedRuleName": "Combine images into CSS sprites",
    "ruleImpact": 0.0
   }
  }
 },
 "version": {
  "major": 1,
  "minor": 11
 }
};

// Try logging the outputs below to test your code!
console.log(ruleList(psinsights));
console.log(totalBytes(psinsights));
