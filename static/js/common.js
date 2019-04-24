function downloadXLS(src) {
  if (navigator.userAgent.indexOf("WOW64") > -1) {
    var download_file = {}
    if (typeof (download_file.iframe) == "undefined") {
      var iframe = document.createElement("iframe");
      download_file.iframe = iframe;
      document.body.appendChild(download_file.iframe);
    }
    download_file.iframe.src = src
    download_file.iframe.style.display = "none";
  } else {
    location.href = src;
  }
}

function defaultDate(range) {
  var date1 = new Date(),
    time1 = date1.getFullYear() + "-" + ((date1.getMonth() + 1)>9?(date1.getMonth() + 1):'0'+(date1.getMonth() + 1)) + "-" + (date1.getDate()>9?date1.getDate():'0'+date1.getDate());
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + range);
  var time2 = date2.getFullYear() + "-" + ((date2.getMonth() + 1)>9?(date2.getMonth() + 1):'0'+(date2.getMonth() + 1)) + "-" + (date2.getDate()>9?date2.getDate():'0'+date2.getDate());
  let defaultDateArr = [];
  defaultDateArr.push(time2, time1)
  return defaultDateArr;
}
module.exports = {
  downloadXLS: downloadXLS,
  defaultDate: defaultDate
}
