import { compressToUTF16 as lzStringCompress, decompressFromUTF16 as lzStringDecompress } from 'lz-string'
import {localStorage} from './storage'
import { openTab, currentDate } from './helpers'

/**
 * windowsArr = await ts2.browser.windows.getAll({populate:true})
 * _ws = ws.fromWindows(windowsArr)
 *
 * ws(name, windows=[{meta: {}, urls=[]}, {meta: {}, urls=[]}])
 * ws.fromUrls(name, urls)
 * ws.fromWindows(name)
 * */


globalThis.lzStringCompress = lzStringCompress
globalThis.lzStringDecompress = lzStringDecompress
export const _stringifyAndCompress = (Obj, verbose=false) => {
  const strData = JSON.stringify(Obj)
  const compressed = lzStringCompress(strData)

  if (verbose) {
    console.log(strData)
    console.log(compressed)
  }
  console.log("Initial Size: " + strData.length);
  console.log("Compresseed Size: " + compressed.length);
  return compressed
}

export class ws {
  static totalWSCount = 0

  constructor(name, _windows = [], skip = false, wsManager = null) {

    this.name = formatName(name)
    this.wsManager = wsManager

    if (!skip) {
      _windows.forEach(w => {
        const { meta, urls, tabs } = w
        if (tabs != []) {
          return ws.fromTabObj(this.name, tabs)
        }
        return ws.fromURLs(this.name, urls, meta, true)
      })
    }

    this.windows = _windows

    ws.totalWSCount += 1

    this.winCount = this.windows.length
    this.tabCount = this.windows.reduce((acc, w) => { return acc + w.tabs.length }, 0)

    if (wsManager) {
      this.wsManager.add(this)
    }
  }

  refreshCounts() {
    this.winCount = this.windows.length
    this.tabCount = this.windows.reduce((acc, w) => { return acc + w.tabs.length }, 0)
  }

  static fromTabObj(name, tabs, meta = {}) {
    return {
      id: `meta_${ ws.totalWSCount }`,
      bounds: [],
      meta: meta,
      tabs: tabs
    }
  }

  static fromURLs(name, urls, meta = {}, returnRawWindow = false) {
    const aWindow = {
      id: `meta_${ ws.totalWSCount }`,
      bounds: [],
      meta: meta,
      tabs: [urls.map((url) => {
        return {
          id: null,
          url: url,
          title: null,
          pinned: null,
          lastActive: null,
        }
      })],
    }

    if (returnRawWindow) {
      return asWindow
    }

    const _ws_structure = {
      name: name,
      windows: [aWindow],
    }

    ws.totalWSCount += 1
    return _ws_structure
  }

  static fromWindows(windowsArr, name, manager) {

    const windows = windowsArr.map(w => {
      const { height, width, top, left, id, tabs } = w
      return {
        id,
        bounds: { height, width, top, left },
        tabs: tabs.map(t => {
          const { url, title, id, pinned } = t
          return { url, title, id, pinned }
        })
      }
    })


    return new ws(name, windows, true, manager)
  }

  isUrlInWS(url) {
    // return 1 or >1 if true
    return this.windows?.map((w) => { return w.tabs.filter(t => t.url.includes(url)) }).flat()?.length != 0
  }

  find(url) {
    // - find all occurence of an url in a WS - return an array of [{ windowIdx, tabindex, urlValue }]
    return this.windows.map((w, idx1) => {
      return w.tabs.map((t, idx2) => t.url.includes(url) ? { w: idx1, t: idx2, url: t.url } : null).filter(i => i)
    }).filter(i => i.length)
      .flat()
  }

  toString() {
    return JSON.stringify({ name, windows })
  }

  save(toLocalStorage = false, compress = false) {
    let wsStr = JSON.stringify({ name: this.name, windows: this.windows })

    if (compress) {
        wsStr = _stringifyAndCompress(wsStr, true)
    }

    if (toLocalStorage) {
      localStorage.setItem(this.name, wsStr);
    }
    return wsStr
  }

  static reload(savedStr) {
    const { name, windows } = JSON.parse(savedStr)
    return new ws(name, windows, true)
  }

  add(url, title = undefined) {
    this.windows?.[this.winCount - 1]?.tabs.push({
      id: null,
      url: url,
      title: title || url,
      pinned: null,
      lastActive: null,
    })

    this.refreshCounts()
    console.log(`Added URL : ${ url } to ${ this.name }`)
    this.save()
  }

  update(urls) {
    _update = urls.map((url) => {
      return {
        id: null,
        url: url,
        title: null,
        pinned: null,
        lastActive: null,
      }
    })
    this.windows.push(_update)
    this.refreshCounts()
    this.save()
  }

  remove(url) {

  }

  open() {
    this.windows.map(w => {
      openTab({
        urls: w.tabs.map(t=>t.url)
      })
    })
  }


}


export const formatName = (name) => {
  let _name = name.trim().toLowerCase()
  return _name[0].toUpperCase() + _name.slice(1)
}

export const formatId = (name) => {
  let id = name.trim().replace(/\s/g, '_').toLowerCase()
  return id
}



// just a list of available ws
export class wsManager {

  all = {}
  name = "WSP_MANAGER"

  constructor() {
    // this.load()
    this.noSave = false
    // this.initialized = false
  }

  add(_ws) {
    const _id = formatId(_ws.name)
    if (_id in this.all) {
      console.log(`The Workspace name:'${ _ws.name }', id:'${ _id } '- already in used`)
    } else {
      this.all[_id] = _ws
    }
    if (!this.noSave) {
      this.save()
    }
  }

  update(_id, tabs) {

  }

  remove(nameOrId) {
    const _id = formatId(nameOrId)
    delete this.all[_id]
    this.save()
  }

  open(id) {
    this.all[_id].open()
  }

  reHydrate({ name = "", windows = [], winCount = 0, tabCount = 0 }) {
    console.log("reHydrating... ", name, windows, winCount, tabCount, this)
    return new ws(name, windows, false, this)
  }

  get(nameOrId) {
    const _id = formatId(nameOrId)
    return this.all[_id]
  }

  save() {
    // const _all_ws_str = JSON.stringify(this.all)
    // localStorage.setItem(this.name, _all_ws_str);
    // console.log("Saved wsManager =>", _all_ws_str)
    // return _all_ws_str
    let toBeSaved = {}
    for (const [wsId, wsObj] of Object.entries(this.all)) {
      wsObj.save(true, true)
      console.log("sub save done")
      toBeSaved[wsId] = { ...wsObj, ...{ wsManager: null } }  // remove the wsManager to not have a circular dependency while stringifying all this
    }

    const _all_ws_str = JSON.stringify(toBeSaved)
    localStorage.setItem(this.name, _all_ws_str);
    console.log("Saved wsManager =>", _all_ws_str)

    return _all_ws_str
  }

  async load() {
    console.log("Loading wsManager");
    // (async ()=>{
    this.noSave = true
    const _all_ws_str = await localStorage.getItem(this.name)
    console.log("ASYNC Loading wsManager", _all_ws_str);
    if (_all_ws_str ){
        const saved = JSON.parse(_all_ws_str)
        // console.log(saved)

        for (const [wsId, wsObj] of Object.entries(saved)) {
        console.log(wsId, wsObj)
        this.reHydrate(wsObj)
        }
        console.log("reLoading wsManager =>", this.all)
    }
    this.noSave = false
    // this.initialized = true
    // })()
  }

  export() {
    const dataString = this.save()
    saveToFile(`workSpace_backup_${currentDate()}.txt`, dataString)
  }

}

// TODO: refactor this - low priority (mv3)
const WS_MANAGER = new wsManager()
await WS_MANAGER.load() // no async constructors? => top level await FTW!

console.log({WS_MANAGER})
export default WS_MANAGER

