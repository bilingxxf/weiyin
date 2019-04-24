// 下载模板
function outputXlsxFile(XLSX, data, wscols, xlsxName) {
  var sheetNames = [];
  var sheetsList = {};
  for (var key in data) {
    sheetNames.push(key);
    var temp = DataExcel(data[key]);
    sheetsList[key] = XLSX.utils.aoa_to_sheet(temp);
    sheetsList[key]['!cols'] = wscols;
  }
  const wb = XLSX.utils.book_new();
  wb['SheetNames'] = sheetNames;
  wb['Sheets'] = sheetsList;
  XLSX.writeFile(wb, xlsxName + ".xlsx");
  //处理数据的函数
  function DataExcel(data) {
    var total = [];
    var temp = data.xlsxHeader;
    total.push(temp);
    data.data.forEach(item => {
      var arr = [];
      data.xlsxAttribute.map((v) => {
        arr.push(item[v])
      })
      total.push(arr);
    })
    return total;
  }
}
module.exports = {
  outputXlsxFile: outputXlsxFile
}
