import { promisify } from './utils'

export class Viewport {
  constructor({ top, left, width, height }) {
    const w = width
    const h = height
    this.width = width
    this.height = height
    this.topLeft = {
      x: left,
      y: top
    }
    this.bottomRight ={
      x: left + w,
      y: top + h
    }
  }
}

export const getOverLappingDistance = (p1t, p1b, p2t, p2b) => {
  return Math.min(p1b, p2b) - Math.max(p1t, p2t)
}

export const getOverlapingArea = (vp1, vp2) => {
  return area(vp1.topLeft, vp1.bottomRight, vp2.topLeft, vp2.bottomRight)
}

export const  area = (r1t, r1b, r2t, r2b) => {
  let h = getOverLappingDistance(r1t.y, r1b.y, r2t.y, r2b.y)
  let w = getOverLappingDistance(r1t.x, r1b.x, r2t.x, r2b.x)
  h = h < 0? 0 : h 
  w = w < 0? 0 : w 
  return w*h
}

// https://github.com/mozilla/webextension-polyfill/issues/158
export const getOverlappingMonitor = async () => {
  
  if (chrome && chrome.system) {
    // find in which monitor the current window is 'more' in
    let displayMonitors = await promisify(chrome.system.display.getInfo)()
    const currWindow = await promisify(chrome.windows.getCurrent)()
    const windowVp = new Viewport(currWindow)
    
    displayMonitors = displayMonitors.map(m => {
      return {
        id: m.id,
        isPrimary: m.isPrimary,
        ...m.bounds,
        overlapArea: getOverlapingArea(windowVp, new Viewport(m.bounds))
      }
    })

    let monitor = displayMonitors.reduce((prev, current) => (prev.overlapArea > current.overlapArea) ? prev : current)
    return monitor
    
  } else {
    return await browser.windows.getCurrent()
  }

}

export const getWindowDim = () => {
  const { outerWidth, availTop, availLeft, outerHeight } = window
  return { width: outerWidth, top: screenTop, left: screenLeft, height: outerHeight }
}

export const getScreenDim = () => {
  const { width, availTop, availLeft, height } = window.screen
  return { width: width, top: availTop, left: availLeft, height: height }
}

export const getMonitorDim = (info) => {
  const { width, top, left, height } = info.bounds
  return { width: width, top: top, left: left, height: height }
}











// await getOverlappingMonitor()

// let screenVp = new Viewport(getScreenDim())
// let windowVp = new Viewport(getWindowDim())
// console.log(screenVp, windowVp)
// getOverlapingArea(windowVp, screenVp)
// area(screenVp.topLeft, screenVp.bottomRight, windowVp.topLeft, windowVp.bottomRight)
// getOverLappingDistance(screenVp.bottomRight.x, windowVp.bottomRight.x, screenVp.topLeft.x, windowVp.topLeft.x)
// getOverLappingDistance(screenVp.bottomRight.y, windowVp.bottomRight.y, screenVp.topLeft.y, windowVp.topLeft.y)

// const isWindowOverlappingWithMonitor = () => {
//   // L x W 
// }