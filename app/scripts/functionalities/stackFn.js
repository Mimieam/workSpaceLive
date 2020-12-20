import {default as browser} from 'webextension-polyfill';
import { getOverlappingMonitor } from '../libs/multiScreen';

// const currentMonitor = (async ()=> {
//   return await getOverlappingMonitor()
// })()

let monitor, getLayout, windowConfig;
const CHROME_TAB_HEIGHT = 35
let EXTRA_SPACING = 25 // this is the top bar spacing - whether it exist or not
// 25 for mac for example - we will let chrome figure it out by itself once we set each newlayout 

getOverlappingMonitor().then(
  (currentMonitor) => {
    monitor = currentMonitor
    const appConfig = {
      'width': 360,
      'height': parseInt(currentMonitor.height * (4 / 5)),
      'left': currentMonitor.left,
      'top': currentMonitor.top
    };
    
    windowConfig = {
      'width': 0,
      'height': 0,
      'left': 0,
      'top': 0,
    };
    console.log("locked and loaded")
    getLayout = (w, wIndex) => {
      // console.log('currentMonitor =', currentMonitor, w, windowConfig)
      const { width, height, left, top } = w
      return {
        ...windowConfig,
        // ...{ width, height, left, top },
        ...{ top: windowConfig.top + wIndex * CHROME_TAB_HEIGHT + EXTRA_SPACING }
      }
    }
    
  })
  
const extraConfig = {
    state: "normal",
    drawAttention: true,
    // focused: true,
    
}

export const stackFn = async () => {
  /*
    // get all windows
    // reformat all windows.
    */
  
  // console.log('monitor=', monitor)
  let all_windows = await browser.windows.getAll({ populate: true });
  all_windows = all_windows
    .filter(x => x.type == "normal")
    .map(async (w, index) => {
    const _newLayout = getLayout(w, index);
    // console.log(w.id, index, _newLayout, windowConfig)
    console.log(w.id, index, _newLayout, w.tabs[0].title)
    await browser.windows.update(w.id, { ..._newLayout, ...extraConfig });
    if (index == 0) {
      EXTRA_SPACING = w.top
    }
    console.log(w.top, EXTRA_SPACING, windowConfig.top + index * CHROME_TAB_HEIGHT + EXTRA_SPACING)
  });
}

export default stackFn