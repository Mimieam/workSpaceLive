/**
 * Active sorting will auto sort the tab of the current window as we are modifying them -
 * note this will not sort after a tab was manually moved by the user
 *
 *  reason :  chrome does not provide a way to detect a mouse up event from the background
 * ( well there is simply no dom and we dont have access to the the native binding - maybe try emscripten??)
 * anyway without that event we can't tell when we are done dragging a tab and so we sort forever.. which is bad xD
 *
 *
 *  */

import { sortTabs, getOptions } from '../background'


export let IS_ON = false

async function listener(tabId, info) {
  const [options, delaySorting] = this
  if (IS_ON) {
    // onUpdate - immediate sorting
    sortTabs(true, options.sort.type, false)
  }
  // console.log("Listener", info, this)
}


export const _useActiveSort = async (_on = false) => {
  const options = await getOptions()
  const on = _on || options.misc.forceSort

  if (on) {
    IS_ON = true
    // console.log("\u2192\u21F4 USING Active Sort - ", sortTabs, options)
    // chrome.tabs.onMoved.addListener(listener.bind([options, true]))
    chrome.tabs.onUpdated.addListener(listener.bind([options, false]))
    console.log('Active Sort = ', on)
  } else {
    IS_ON = false
    // try {
    chrome.tabs.onUpdated.removeListener(listener);
    console.log('Active Sort = ', on)
    // } catch(e) {
    //     console.log(e);
    // }
    // chrome.tabs.onMoved.removeListener(listener)
  }
  return on
}

export { _useActiveSort as useActiveSort }
