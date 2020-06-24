
// window.getSelection().toString()

/**
 * Financial data 
 * https://observablehq.com/@stroked/yahoofinance
 * https://github.com/Stroked/trading-day/blob/master/src/utils/fetch.js   <- great app that could be used as reference
 * https://query2.finance.yahoo.com/v10/finance/quoteSummary/AApl?modules=financialData,assetProfile,defaultKeyStatistics
 * https://query2.finance.yahoo.com/v7/finance/quote?symbols=AAPL,FB
 * https://query2.finance.yahoo.com/v8/finance/chart/GOOG?period1=1388563200&period2=1509694074&interval=1d&events=history
 * https://query1.finance.yahoo.com/v8/finance/chart/GOOG?range=1d&includePrePost=false&interval=2m&corsDomain=finance.yahoo.com&.tsrc=finance
 * https://iexcloud.io/ 
 * https://towardsdatascience.com/free-stock-data-for-python-using-yahoo-finance-api-9dafd96cad2e
 * https://python-yahoofinance.readthedocs.io/en/latest/api.html
 * 
 * 
 * API to get financial symbols
 * http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=AMD&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback
 * http://d.yimg.com/aq/autoc?query=y&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks
 * https://dumbstockapi.com/stock?exchanges=NYSE
 * 
 * @param {} url 
 */

const shortenURL = (url) =>{
  return new Promise((resolve, reject) =>
    fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  }).then((res) => {
      const data = res.json();
      resolve(data);
  }).catch((e) => reject(e)));
}