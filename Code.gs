/**
 * CSE is limited to 100 queries per day...$5 per 1000 after tha
 */

function onOpen() {
    var app = SpreadsheetApp.getUi();
    app.createMenu('URLs')
        .addItem('Return URLs', 'generateQuery')
        .addToUi();
}

function search(q) {
    var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=%KEY%&cx=%CX%&q=%Q%";
    var ApiKey = "YOUR_API_KEY";
    var searchEngineID = "YOUR_CSE_ID";

    var url = urlTemplate
        .replace("%KEY%", encodeURIComponent(ApiKey))
        .replace("%CX%", encodeURIComponent(searchEngineID))
        .replace("%Q%", encodeURIComponent(q));

    var params = {
        muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(url, params);
    var respCode = response.getResponseCode();

    if (respCode !== 200) {
        throw new Error("Error" + respCode + " " + response.getContentText());
    } else {
        var content = JSON.parse(response);
    }
    return content;
}

function generateQuery() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var s = ss.getSheetByName('Sheet1');
    var urlRange = s.getRange(2, 3, s.getLastRow(), 1).getValues();
    var resultsRange = parseInt(s.getRange(1, 5).getValue());
    var urls = [];

    for (i = 0; i <= urlRange.length; i++) {
        var q = urlRange[i];
        var content1 = search(q);


        for (var j = 0; j <= resultsRange - 1; j++) {
            var adding = (content1.items[j].link);
            console.log(adding);
            urls.push([adding]);
        }

        var range = s.getRange(2, 4 + i, resultsRange, 1);
        range.setValues(urls);
        urls = [];
    }
}
