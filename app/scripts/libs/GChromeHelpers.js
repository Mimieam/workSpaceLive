import {
  promisify
} from './utils'

const DEBUG = true
const GCTabs = {}
const GChromeWindow = {}

GCTabs.get = promisify(chrome.tabs.get)
GCTabs.query = promisify(chrome.tabs.query)
GCTabs.update = promisify(chrome.tabs.update)
GChromeWindow.get = promisify(chrome.windows.get)
GChromeWindow.getAll = promisify(chrome.windows.getAll)
GChromeWindow.create = promisify(chrome.windows.create)
// GChromeWindow.getLastFocused = promisify(chrome.windows.getLastFocused)

/**
 * get a window object
 *
 * @returns {Array} returns an array with only 1 promise of a chrome window object
 */
GChromeWindow.getWindow = async (windowID) => new Promise((resolve, reject) => {
  DEBUG && console.log(`getWindow=> ${windowID}`)
  chrome.windows.get(windowID, {
    populate: true
  }, (data) => {
    console.log('Current Window Id', data.id, data.focused)
    return resolve([{
      windowId: data.id,
      window: data,
      tabs: data.tabs
    }])
  })
})

GChromeWindow.getLastFocused = async (populate = false) => {
  const w = await new Promise((resolve) => chrome.windows.getLastFocused({
    populate
  }, (t) => resolve(t)))
  return w
}
/**
 * This function create a new window with discared tabs if the discard
 * flag is set to true - note that the first and last tabs will not be discared
 *
 * @param {object} options - an array of strings
 * @param {boolean} discard - a flag
 */
GChromeWindow._createWindow = async (options = {}, discard = false) => {
  const w = await new Promise((resolve, reject) => {
    // create a blank window
    chrome.windows.create({}, async (newW) => {
      console.log(`New Windows Created with ID : ${newW.id}`, newW, options.url)

      options.url = options.url ? options.url : []
      const _urls = options.url // adding the other tabs..

      const tabsPromiseArray = await _urls.map(
        (_url, idx) => {
          console.log(`trying to open new URL => : ${newW.id}`, newW, options.urls)
          if (idx === _urls.length - 1) {
            return GCTabs.createTabAtWindowID(_url, newW.id, false)
          }
          return GCTabs.createTabAtWindowID(_url, newW.id, discard)
        }
      )
      // console.log('New TABS = ',newW.tabs)
      // TODO2: DELETE THE VERY FIRST EMPTY TAB CREATED BY THE NEW WINDOW ACTION
      // TODO: prevent discard of the very last tab
      const tpa = await Promise.all(tabsPromiseArray) // wait to be done
      console.log('new tabs??', newW.tabs, tpa)
      // await GCTabs.closeEmptyTabs(newW.tabs)
      resolve(newW) // return the newly created window
    })
  })
  return w
}
/**
 * regornativeTabs into different set windows as provied by the _2dArrayOfIdx
 * @param  {[type]} dataArr    [description]
 * @param  {[type]} layout [description]
 * @return {[type]}        [description]
 */
GChromeWindow._reorganizeWindows = async (dataArr, layout) => {
  // each element of data is a window with it's tab
  dataArr.sort((a, b) => b.length - a.length) // largest window at the back
  // chrome.window.create - ignores the top property.. so i need to update after creating..
  // https://bugs.chromium.org/p/chromium/issues/detail?id=958881&can=1&start=100&num=100&q=chrome.windows.create
  dataArr.map(async (_tabs, index) => {
    const opt = {
      // left: _left,
      top: 23 + 33 * index
    }
    console.log(opt)
    // let opt = sideBySide ? await getNewWindowOptions(index, numberOfWindows) : {}
    // move all the tab
    await moveToNewWindow(_tabs, opt, (win) => {
      // _top += 50
      // when all the tabs have been moved activate the right one
      // now we need to focus the same tab from which we split
      const [future_active_tab] = _tabs
      chrome.tabs.get(future_active_tab, (tab) => {
        // console.log(_top)
        chrome.windows.update(tab.windowId, opt)
        // chrome.tabs.highlight({windowId:tab.windowId, 'tabs': tab.index}, function(data) { console.log("DONE", tab, data)});
      })
    })
  })
}
GCTabs.createTabAtWindowID = (url, wID, discard = false) => {
  const t = new Promise((resolve) => {
    chrome.tabs.create({
      url,
      windowId: wID
    }, async (tab) => {
      // console.log(`[new tab: ${url} -- created !] `)
      if (discard) {
        chrome.tabs.onUpdated.addListener(async function listener(tabId, info) {
          if (info.status === 'complete' && tabId === tab.id) {
            // console.log("ready to discard")
            await chrome.tabs.discard(tab.id, (discaredTab) => {
              // console.log(`created & Unloaded from mem -> ${tab.url}`)
            })
            chrome.tabs.onUpdated.removeListener(listener);
            resolve(tab);
          }
        })
      }
    })
  })
  return t
}
// GChromeWindow.getAll = promisify(chrome.windows.getAll)
/**
 * Close any empty tabs
 *
 * @param {array} tabs  - array of chrome tab objects
 * @returns
 */
GCTabs.closeEmptyTabs = (tabs) => {
  const emptyTabs = tabs.filter((t) => t.url.includes('chrome://newtab/')).map((t) => t.id)
  // console.log(emptyTabs)
  if (emptyTabs.length > 0) {
    chrome.tabs.remove(emptyTabs, (t) => {
      console.log(`${emptyTabs.length || 0} empty tabs closed`)
    })
  }
  return emptyTabs
}
