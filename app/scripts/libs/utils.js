/**
 * Chrome Storage setter helper
 *
 * @param {name: value} obj
 * @returns Promise
 */
export const set = (obj) => new Promise((resolve, reject) => {
  const key = Object.keys(obj)[0]
  const o = obj
  o[key] = JSON.stringify(obj[key])
  chrome
    .storage
    .local
    .set(o, () => {
      console.log(`${JSON.stringify(o)} saved`);
      resolve(o)
    });
})

/**
 * Chrome Storage getter helper
 *
 * @param {string} name
 * @returns Promise
 */
export const get = (name) => new Promise((resolve, reject) => {
  chrome
    .storage
    .local
    .get(name, (dataObj) => {
      const res = Object.keys(dataObj).includes(name) ? dataObj[name] : '{}'
      resolve(JSON.parse(res))
    });
})


export const ChromeRPC = {
  _getExtId: () => chrome.runtime.id,
  sendMessage: (params, fn) => {
    // console.log(chrome.runtime.id)
    chrome.runtime.sendMessage(chrome.runtime.id, params, fn);
  },
  onMessage: (MessageHandler) => {
    chrome.runtime.onMessage.addListener(MessageHandler);
  },
}

// inspired from https://gist.github.com/pincheira/2724082#gistcomment-2662810
export const improvedConsoleLog = (name, console, debugFlag) => {
  const DEBUG = debugFlag
  const orig = console.log
  function log(...args) {
    if (DEBUG) {
      orig.apply(console, [`[${name}]:`, args])
    }
  }
  return log
}


export const promisify = (fn) => (...args) => new Promise((resolve, reject) => {
  fn(...args, (value, error) => {
    if (error) {
      reject(error);
    } else {
      resolve(value);
    }
  });
});

export const asyncPromisify = (fn) => async (...args) => new Promise((resolve, reject) => fn(...args, (val, err) => (err ? reject(err) : resolve(val))))


/**
 * Shift Left by 1 and append new value
 * @param  {[type]} arr   an array
 * @param  {[type]} value
 * @return {array}  retuns the modified array
 */
export const shiftLeftAndAppend = (arr, value) => {
  arr.push.apply(arr.push(value), arr.splice(0, 1))
  return arr
}

/**
 * keep the last selected window id at the most right of the array
 * this is used to select the last 2 window to be merged
 *
 */
export const appendAndReorganize = (arr, x) => [...arr.filter((t) => t !== x), x]


/**
 * Array flattener helper function
 *
 * @param {any} arr
 */
export const flatten = (arr) => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

/**
 * reorder arr1 according to order of elments in arr2
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @param  {[type]} unordered_last defines what to do with items in arr2 but not in arr1
 * @return {[type]}      [description]
 */

// arr1 = [3,2,4,5,22,1,0,2]
// arr2 = [1,3,4,2,5,6]
const alignArrays = (arr1, arr2, unordered_last = true) => {
  let _arr1 = [...arr1]
  _arr1.sort((a, b) => arr2.indexOf(a) - arr2.indexOf(b))
  if (unordered_last) {
    const ordered = _arr1.filter((x) => arr2.includes(x))
    const unordered = _arr1.filter((x) => !arr2.includes(x))
    // console.log(ordered, unordered)
    _arr1 = [...ordered, ...unordered]
    // console.log(_arr1)
  }
  return _arr1
}


const intersection = (arr1, arr2) => arr1.filter((x) => arr2.includes(x))
const difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x))
const symmetric_difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x))
  .concat(arr2.filter((x) => !arr1.includes(x)))


/**
 *  find the correct window id for each tab_ids
 * @param  {Object} state
 * @param  {Object} cc    map of {
 *                           tab_id: urls,
 *                           ...
 *                        }
 * @return {Object}       map of {
 *                            w_id: [ tab_id, ...],
 *                            ...
 *                         }
 */
// const _reversed_map = (state, cc ) =>
//     state.map(w => {
//       return {[w.id]: [...Object.keys(cc).filter(_id => w.tabs.map(t => t.id).includes(+_id)) ]}
//     }).reduce((acc, val) => {return {...val, ...acc}})


/**
 * pivot a set of data according to the index
 * aka, emulate a groupBy column...
 *
 * @param  {[type]} _dict      the dictionary to be pivoted
 * @param  {[type]} idx        index of the column to be used a new dictionary key
 * @param  {[type]} inThisCol      optional column for further filtering of inner array
 * @param  {[type]} ignoreValue    value to be ignored related to inThisCol
 * @return {[type]}            [description]
 */
export const pivotThis = (_dict, idx, inThisCol, ignoreValue) => Object.values(_dict)
  .filter((el) => !(el[0] instanceof Array)) // dont care about nested array
  .filter((el) => (inThisCol ? (el[inThisCol] !== ignoreValue) : el))
  .map((x) => ({ [x[idx]]: x }))
  .reduce((acc, val) => {
    const newKey = Object.keys(val)[0]
    const res = { [newKey]: (Object.keys(acc).includes(newKey) ? [...acc[newKey], [...val[newKey]]] : [val[newKey]]) }
    return { ...acc, ...res }
  }, {})


export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// export const sleepFor = (time=1000, thenDo=()=>{}) => setTimeout(function(){
//     // thenDo()
//     console.log("DONESLEEPING!!!!!")
// }, time);

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
// thanks to https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
// function shadeHexColor(color, percent) {
//   const f = parseInt(color.slice(1), 16); const t = percent < 0 ? 0 : 255; const p = percent < 0 ? percent * -1 : percent; const R = f >> 16; const G = f >> 8 & 0x00FF; const B = f & 0x0000FF;
//   return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
// }


// https://stackoverflow.com/a/50228121/623546
export function deepMerge(current, update) {
  Object.keys(update).forEach((key) => {
    // if update[key] exist, and it's not a string or array,
    // we go in one level deeper
    if (current.hasOwnProperty(key)
        && typeof current[key] === 'object'
        && !(current[key] instanceof Array)) {
      deepMerge(current[key], update[key]);

    // if update[key] doesn't exist in current, or it's a string
    // or array, then assign/overwrite current[key] to update[key]
    } else {
      current[key] = update[key];
    }
  });
  return current;
}


export const isInExcludedList = (domain_str, excluded_list) =>
// console.log(domain_str, excluded_list,  excluded_list.some(
//         (x)=> domain_str.toLowerCase().includes(x.toLowerCase())
//       ))
  excluded_list.some(
    (x) => domain_str.toLowerCase().includes(x.toLowerCase()),
  )



export const generateRandomColor = (cycleColors) => {
  /*
  *  dark mint green - #137a63 - dark blue - #137
  * #41296b
  */
  const currentVersionColor = '#41296b'
  return cycleColors ? `#${((1 << 24) * Math.random() | 0).toString(16)}`.padEnd(7, 0) : currentVersionColor
}

export const saveToStorage = (itemObject, storageType='sync') => {
  storageType = storageType.toLowerCase()
  storageType = ['sync', 'local'].includes(storageType) ? storageType : 'local'

  return chrome.storage[storageType].set(itemObject, () => { console.log('Item saved - ', itemObject) })
}

export const loadFromStorage = async (itemStr) => {
 return chrome.storage.sync.get([itemStr], (store) => {
    console.log(`\u2192\u21F4 ${itemStr}`, store);
  })
}

