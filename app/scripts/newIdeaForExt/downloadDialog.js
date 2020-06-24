

const openSaveAsDialog = (dataString, filename="TS2_file.txt") =>{
  // opens the save dialog window and will save a string of data to a file
  data = "data:application/octet-stream,"+encodeURIComponent(dataString)
  chrome.downloads.download({
      url: data,
      filename: filename,
      saveAs: true
  }, function (downloadId) {
      console.log(downloadId);
  });
}
