import { keepThemPinned, getOptions } from '../background'

export let IS_ON = false

async function listener(tabId, info) {
  // const [options, delaySorting] = this
  // console.log("drag pinned tabs")
  if (IS_ON) {
    keepThemPinned()
  }
}


export const _useActivePinning = async (_on = false) => {
  const options = await getOptions()
  const on = _on || options.misc.forcePinned
  // console.log(options.misc.forcePinned,  _on)

  if (on) {
    IS_ON = true
    // chrome.tabs.onActivated.addListener(listener)
    chrome.windows.onFocusChanged.addListener(listener)
    chrome.windows.onCreated.addListener(listener)
    console.log('Active Tab Pin = ', on)
  } else {
    IS_ON = false
    // chrome.tabs.onActivated.removeListener(listener)
    chrome.windows.onFocusChanged.removeListener(listener);
    chrome.windows.onCreated.removeListener(listener);
    console.log('Active Tab Pin = ', on)
  }
  return on
}

export { _useActivePinning as useActivePinning }
