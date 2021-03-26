# Scraping Google search results into a spreadsheet using Google App Script & JSON API
## Overview
This Google App Script allows you to fill a spreadsheet with queries and, utilizing the Google CSE endpoint, scrape the first ten web results for each query.

## Description 
TLDR; fill up a spreadsheet with queries, and return their highest traffic search results.

I developed this script with the intent of scraping the highest traffic query results for a list of terms stored in a spreadsheet.

## Usage
The script can be used by populating the first two columns of a spreadsheet wth separate query patterns, setting a number of search results to return, and running the script from the Extensions > Google Apps Script IDE. I format my spreadsheet and add a concatenate function like below to easily adjust the # of queries and quickly bulk search similar terms.

Query Key 1 | Query Key 2 | Concat Query | # of Results -> | 7 
------------ | ------------- | ------------- | ------------- | ------------- 
Casting and forging supplier | China | `==iferror(concatenate(A2, " ", B2))` | -- | -- |
Casting and forging supplier | Korea | `==iferror(concatenate(A3, " ", B3))` | -- | -- |
Casting and forging supplier | Germany | `==iferror(concatenate(A4, " ", B4))` | -- | -- |

As for the scrip - First, we initialize our API endpoint, API credentials, CSE ID, and build a custom URL
```javascript
function search(q) {
    var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=%KEY%&cx=%CX%&q=%Q%";

    //credentials & search engine ID
    var ApiKey = "AIzaSyCIviW9osWSEwYZFhjXF0tYeLGWRazLAo4";
    var searchEngineID = "018397015358995751386:r4ou0nv1h5g";

    //custom url
    var url = urlTemplate
        .replace("%KEY%", encodeURIComponent(ApiKey))
        .replace("%CX%", encodeURIComponent(searchEngineID))
        .replace("%Q%", encodeURIComponent(q));

    var params = {
        muteHttpExceptions: true
    };

    //search query
    var response = UrlFetchApp.fetch(url, params);
    // Logger.log(response);
    var respCode = response.getResponseCode();

    if (respCode !== 200) {
        throw new Error("Error" + respCode + " " + response.getContentText());
    } else {
        //search successful
        var content = JSON.parse(response);
    }
    return content;
}
```
Here, we load the active spreadsheet, the range and # of queries we want to search, and initialize an array to push the URLs to:
```javascript
function generateQuery() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var s = ss.getSheetByName('Sheet1');
    var urlRange = s.getRange(2, 3, s.getLastRow(), 1).getValues();
    var resultsRange = parseInt(s.getRange(1, 5).getValue());
    var urls = [];
```
Then, we call the `search()` function and JSON API to iterate through each object, and write the URLs to the spreadsheet with the `.setValues()` method.
```javascript
for (i = 0; i <= urlRange.length; i++) {
    var q = urlRange[i];
    var content1 = search(q);
    for (var j = 0; j <= resultsRange - 1; j++) {
        var adding = (content1.items[j].link);
        urls.push([adding]);
    }
    var range = s.getRange(2, 4 + i, resultsRange, 1);
    range.setValues(urls);
    urls = [];
}
}
```
## Limitations
* The default number of queries the JSON API will return per page is 10, so to access more pages and results, one would need to fiddle with the `&start=` CGI parameter when building the URL.
* The Custom Search Engine Service only allows 100 queries per day. After that, a fee is paid per 1000 queries.

## References 
[Custom Search JSON API](https://developers.google.com/custom-search/v1/introduction)
[Programmable Search Engine](https://developers.google.com/custom-search)

## Author
[jopringle](https://github.com/whosthatnewguy/GAS-revisions)

Please feel free to contact me with any suggestions or questions.

## Changelog
* v1.0.1 (March 26, 2021)
