
function search(q){
  var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=%KEY%&cx=%CX%&q=%Q%";

  // Script-specific credentials & search engine
  var ApiKey = "";
  var searchEngineID = "";

  // Build custom url
  var url = urlTemplate
    .replace("%KEY%", encodeURIComponent(ApiKey))
    .replace("%CX%", encodeURIComponent(searchEngineID))
    .replace("%Q%", encodeURIComponent(q));

  var params = {
    muteHttpExceptions: true
    };

    //search query
    var response = UrlFetchApp.fetch(url,params);
    // Logger.log(response);
    var respCode = response.getResponseCode();

    if(respCode !== 200){
      throw new Error ("Error" +respCode + " " + response.getContentText());
    } else {
      //search successfu
      var content = JSON.parse(response);
    }
    return content;

}

function generateQuery(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName('Sheet1');
  var urlRange = s.getRange(1,3,s.getLastRow(),1).getValues();
  var urls = [];
  
  for(i=0; i<=urlRange.length+1 ;i++){
    var q = urlRange[i];
    var content1 = search(q);
    var count = content1.items.length;
    Logger.log(count);
    Logger.log(content1.items);

    for(var j=0;j < count;j++){
      var adding = (content1.items[j].link);
      // Logger.log(content1.items[j].link);
      // Logger.log(content1.items[j].snippet);
      urls.push([adding]);
      }
      var range = s.getRange(1,4+i,count,1);
      range.setValues(urls);
      urls = [];
    }
    }

function concat(location, terms){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName('Sheet1');

  //var location = s.getRange(1,1, s.getLastRow(),1).getValues();
  //var terms = s.getRange(1,2, s.getLastRow(),1).getValues();

  for (i=0;i<=location.length;i++){
    Logger.log(location[i] + " " + terms[i]);
  }

  
}
