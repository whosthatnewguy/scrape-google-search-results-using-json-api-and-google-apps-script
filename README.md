# Bulk scraping Google search results into a spreadsheet with Google App Script
## Overview
This Google App Script allows you to fill a spreadsheet with queries and, utilizing the Google CSE endpoint, scrape the first ten web results for each query.

## Description 
TLDR; Fill up a spreadsheet with queries, and return their highest traffic search results.

I developed this script with the intent of scraping the highest traffic query results of a list of terms stored in a spreadsheet. Potentially has multiple applications for different situations.

## Usage
The script can be used by populating the first two columns wth separate query patterns, then selecting the `Return URLs` button at the top.

First, we initialize our API endpoint, personal API credentials, a Custom Search Engine ID, and build a custom URL
```javascript
function search(q){
  var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=%KEY%&cx=%CX%&q=%Q%";
  var ApiKey = "YOUR_API_KEY";
  var searchEngineID = "YOUR_SEARCH_ENGINE_ID";
  var url = urlTemplate
    .replace("%KEY%", encodeURIComponent(ApiKey))
    .replace("%CX%", encodeURIComponent(searchEngineID))
    .replace("%Q%", encodeURIComponent(q));

  var params = {
    muteHttpExceptions: true
    };
```
