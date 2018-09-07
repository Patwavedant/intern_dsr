/* The script is deployed as a web app and renders the form */
function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile('forms.html')
    .setTitle("Daily Status Report - RISE 2018");
}

function getTodayDate(){
   
  // Get Date and create file corresponding to the date:
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd;
  } 
  if(mm<10){
    mm='0'+mm;
  } 
  var today = dd+'/'+mm+'/'+yyyy;
  return today;
}

function uploadFileToGoogleDrive(data, file, name) {

  try {

    var dropbox = "My Dropbox";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, file);

    /* This is the second level for searching folder inside main directory */
    //folders = DriveApp.getFoldersByName(email);
    
    folders = DriveApp.getFoldersByName(name);
    if(folders.hasNext()) {
      folder = folders.next();
    }
    
    folder.createFile(blob);
    // spreadsheetReportManager(name);
    return "Submitted - Thanks! 🤘";

  } catch (f) {
    return f.toString();
  }
}


function sendScheduledMail(){
  if(isFileExist()){  
    Logger.log("200 - File Found to send");
    MailApp.sendEmail("brbtottyl@gmail.com",
                      "patwavedant@gmail.com",
                      "RISE JUNE 18 - DSR Report "+getTodayDate(),
                      getTodayDate()+"_DSR Report. Follow link to open the page: "+spreadsheetReportManager("That's all"));
  }
  else{
    Logger.log("404 - File Not Found - Can't send the mail");
  } 
}

function isFileExist(){
  var today = getTodayDate();
  var FLAG  = false;
  var SheetName = today+"_DSR_RISE_JUNE_18";
  var file = null;
  
  var files = DriveApp.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if(file.getName() == SheetName){
      FLAG = true;
      Logger.log("File Found");
      return file;
    }else{
      return 0;
    }
}
}


function spreadsheetReportManager(username_) {
  
  var today = getTodayDate();
  var SheetName = today+"_DSR_RISE_JUNE_18";
  console.log(SheetName);
  var yourNewSheet = null;
  var STATUS = isFileExist();
  if(STATUS){
    yourNewSheet = SpreadsheetApp.open(STATUS);
    Logger.log("spreadsheetReportManager -> If Part");
  }
  else{
    yourNewSheet = SpreadsheetApp.create(SheetName);
  }  
  var index = 1;
  // yourNewSheet.insertColumnsBefore(1, yourNewSheet.getLastRow());
  // yourNewSheet.getRange(yourNewSheet.getLastRow()+1, 1, username_.length, 1).setValues(username_);
  yourNewSheet.appendRow([username_]);
  var URL = yourNewSheet.getUrl();
  Logger.log(URL);
  return URL;
}
