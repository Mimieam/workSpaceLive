import {default as browser} from 'webextension-polyfill';
import { getOverlappingMonitor } from '../libs/multiScreen';

// const currentMonitor = (async ()=> {
//   return await getOverlappingMonitor()
// })()

let DEFAULT_POPUP = {
  width: 500,
  height: 375
}

let monitor, getLayout, windowConfig;
const CHROME_TAB_HEIGHT = 35
let EXTRA_SPACING = 0 // this is the top bar spacing - whether it exist or not
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
      'left': currentMonitor.left,
      'top': currentMonitor.top,
    };
    
    console.log("locked and loaded")

    getLayout = (w, wIndex) => {
      // const { width, height, left, top } = w
      return {
        ...windowConfig,
        ...{ top: windowConfig.top + wIndex * CHROME_TAB_HEIGHT + EXTRA_SPACING }
      }
    }    
  }
)
  
const extraConfig = {
    state: "normal",
    drawAttention: true,
    // focused: true,
    
}

const calibrateUsingFirstWindow = async (w) => {
  
  const old_state = {
    'width': w.width,
    'height': w.height,
    'left': w.left,
    'top': w.top,
  }
  // the calibrated window - is a default window with it's minimum values as set by the browser...
  const calibrated_window = await browser.windows.update(w.id, { ...{ 'left': 0, 'top': 0, 'width': 0, 'height': 0 } })
  const { width, height, left, top } = calibrated_window
  console.log('CALIBRATED W: ', { width, height, left, top } )
  
  windowConfig = { width, height, left, top }
  // EXTRA_SPACING = top
  browser.windows.update(w.id, { ...old_state })

}

export const stackFn = async () => {
  /*
    // get all windows
    // reformat all windows.
    */
  
  let all_windows = await browser.windows.getAll({ populate: true });
  await calibrateUsingFirstWindow(all_windows[0])
  all_windows = all_windows
    // .filter(x => x.type == "normal")
    .map(async (w, index) => {    
      const _newLayout = getLayout(w,  index);

      console.log(w.id, index, _newLayout, w.tabs[0].title)

      await browser.windows.update(w.id, { ..._newLayout, ...extraConfig, ...(w.type === "normal" ? {} : DEFAULT_POPUP) });

      console.log(w.top, EXTRA_SPACING, windowConfig.top + index * CHROME_TAB_HEIGHT + EXTRA_SPACING)
  });
}

export default stackFn