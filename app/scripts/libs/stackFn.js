import browser from 'webextension-polyfill';
import { getOverlappingMonitor } from './multiScreen';

const currentMonitor = await getOverlappingMonitor()
const SPACING = 100

const appConfig = {
  'width': 360,
  'height': parseInt(currentMonitor.height * (4 / 5)),
  'left': currentMonitor.left,
  'top': currentMonitor.top
};

const windowConfig = {
  'width': currentMonitor.width - appConfig.width,
  'height': appConfig.height,
  'left': currentMonitor.left + appConfig.width,
  'top': currentMonitor.top
};

const getLayout = (windowConfig, wIndex) => {
  return {
    ...windowConfig,
    ...{ top: windowConfig.top + wIndex * SPACING }
  }
}

browser = chrome ? chrome : browser

export const stackFn = () => {
  /*
    // get all windows
    // reformat all windows.
    */
   const all_windows = (await browser.windows.getAll()).filter(x => x.type == "normal")
   all_windows.map((w, index) => {
      const _newLayout = getLayout(w, index)
      browser.windows.update(parentWindow.id, { ..._newLayout }) 
   })
}

export default stackFn