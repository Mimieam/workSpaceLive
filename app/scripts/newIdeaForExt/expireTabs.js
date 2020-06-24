/**
 * Once every 15 min check all tabs for how long they were open
 * web used with chrome://flags/#tab-hover-cards enabled
 * and This can Read and Change Side Data > on All Sites | used to update the title after X amount of time
 * 
 * Usage: import { expireThisTab } from './expireTabs'
 */

import moment from 'moment';
import browser from 'webextension-polyfill';

window.moment = moment;

// get accurate hours and minutes instead of "days ago"
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24 * 26);
// moment.updateLocale('en', {
//   relativeTime : {
//       future: "in %s",
//       past:   "%h:%m:%s ago",
//       s  : 'a few seconds',
//       ss : '%ds',
//       m:  "1m",
//       mm: "%dm",
//       h:  "1h",
//       hh: "%dh",
//       d:  "1d",
//       dd: "%dd",
//       w:  "1w",
//       ww: "%dw",
//       M:  "1m",
//       MM: "%dm",
//       y:  "1y",
//       yy: "%dy"
//   }
// });


let TABS_TIMES = { }

const ENUM = {
  onCreated:{},
  onUpdated:{}
}

const STORAGE_KEY_NAME = "TABS_TIMES"

const saveToLocalStorage = (key, value, compress = false) => {
  const json_str = JSON.stringify(value)
  localStorage.setItem(key, json_str);
  // console.log(`Saved ${key}|=>\n ${json_str}`)
  return json_str
}

const loadFromLocalStorage = (key) => {
  TABS_TIMES = JSON.parse(localStorage.getItem(key))
  return TABS_TIMES
}

loadFromLocalStorage(STORAGE_KEY_NAME)

const _get_proper_title = (title, separator='-⌛️-') => {
  let res = title.split(separator) 
  return res[res.length - 1]
}

export const expireThisTab = (tabId, threshold) => {
  if (tabId in TABS_TIMES) {
    let timeRepr = moment(TABS_TIMES[tabId].prev_updated_at).fromNow() 
    console.log("expireThisTab =>", tabId, timeRepr)
    chrome.tabs.get(tabId, async (tab) => {
      TABS_TIMES[tabId].url = tab.url
      let title = _get_proper_title(tab.title)
      title = `(${ timeRepr })-⌛️-${ title }`
      await chrome.tabs.executeScript(tabId, { code: `document.title = '${ title }'`}, (data) => { console.log('we are done', data)});
    })
  }
}

const _onTabEventHandler = ({type='', tabId=null, changeInfo={}, tab={}}) => {
  
  const _tabId = tabId || tab.id

  type == ENUM.onCreated 
  const currTime = moment().format()
  const timeInfo = {
    ...(type == ENUM.onCreated && { created_at: currTime, prev_updated_at: currTime, updated_at: currTime }),
    ...(type == ENUM.onUpdated &&
    {
      created_at: TABS_TIMES[_tabId]?.created_at || currTime,
      prev_updated_at: TABS_TIMES[_tabId]?.updated_at|| currTime,
      updated_at: currTime
    })
  }

  let tInfo = {
    id: _tabId,
    url: tab?.url || TABS_TIMES[_tabId]?.url,
    ...(timeInfo)
  }

  TABS_TIMES[_tabId] = {
    ...TABS_TIMES[_tabId],
    ...tInfo
  } 
  return tInfo
}

const onCreatedHandler = (tab) => {
  _onTabEventHandler({ type: ENUM.onCreated, tab: tab})
  console.log("onTabCreated", TABS_TIMES)
}

const onUpdatedHandler = (tabId, changeInfo, tab) => {
  console.log('onTabUpdated', changeInfo, tab)
}

const onActivatedHandler = (activeInfo) => {
  console.log("Tab Activated - ", activeInfo)
  _onTabEventHandler({ type: ENUM.onUpdated, tabId: activeInfo.tabId }) 
  console.log(TABS_TIMES)
  expireThisTab(activeInfo.tabId)
}

const onRemoveHandler = (tabId, removeInfo) => {
  console.log("onTabRemoved", tabId, removeInfo)
  if (tabId in TABS_TIMES) {
    delete TABS_TIMES[tabId]
  }
}


setInterval(async () => { 
  const tabs = await browser.tabs.query({})
  tabs.map(t => {
    _onTabEventHandler({ type: ENUM.onUpdated, tabId: t.id, tab: t }) 
    expireThisTab(t.id)
    saveToLocalStorage(STORAGE_KEY_NAME, TABS_TIMES)
  })
  console.log("checking Tabs")
}, 60000)

chrome.tabs.onCreated.addListener(onCreatedHandler)
chrome.tabs.onUpdated.addListener(onUpdatedHandler)
chrome.tabs.onActivated.addListener(onActivatedHandler)
chrome.tabs.onRemoved.addListener(onRemoveHandler)


