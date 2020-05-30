import LZString from 'Lz-string'

/**
 * windowsArr = await ts2.browser.windows.getAll({populate:true})
 * _ws = ws.fromWindows(windowsArr)
 * 
 * ws(name, windows=[{meta: {}, urls=[]}, {meta: {}, urls=[]}])
 * ws.fromUrls(name, urls)
 * ws.fromWindows(name)
 * */


export class ws {
  static totalWSCount = 0

  constructor(name, _windows = [], skip = false, wsManager=null) {
    
    this.name = formatName(name)

    if (!skip) {
      _windows.forEach(w => {
        const { meta, urls } = w
        return this.fromURLs(this.name, urls, meta, returnRawWindow = true)
      })
    }

    this.windows = _windows

    ws.totalWSCount += 1

    if (wsManager) {
      wsManager.add(this)
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

  static fromWindows(windowsArr, name) {
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
    const winCount = windows.length
    const tabCount = windowsArr.reduce((acc, w) => { return acc + w.tabs.length }, 0)

    return new ws(name, windows, true)
    // return { name, windows, tabCount, winCount }
  }

  isUrlInWS(url) {
    // return 1 or >1 if true
    return this.windows?.map((w) => { return w.tabs.filter(t => t.url.includes(url)) }).flat()?.length != 0
  }

  find(url) {
    // - find all occurence of an url in a WS - return an array of [{ windowIdx, tabindex, urlValue }]
    return this.windows.map((w, idx1) => {
      return w.tabs.map((t, idx2) => t.url.includes(url) ? { w: idx1, t: idx2, url: t.url} : null).filter(i => i)
    }).filter(i => i.length)
      .flat()
  }

  toString() {
    return JSON.stringify({name, windows})
  }

  save(toLocalStorage=false, compress=false) {
    let wsStr = JSON.stringify({ name, windows })

    if (compress) {
      console.log("Size of sample is: " + wsStr.length);
      var compressed = LZString.compressToUTF16(wsStr);
      console.log("Size of compressed sample is: " + compressed.length);
      var compressed = LZString.compressToUint8Array(wsStr);
      console.log("Size of compressed sample is: " + compressed.length);
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

}


export const formatName = (name) => {
  let _name = name.trim().toLowerCase()
  return _name[0].toUpperCase() + _name.slice(1)
}

export const formatId = (name) => {
  let id = name.trim().replace(/\s/g, '_').toLowerCase()
  return  id
}



// just a list of available ws
export class wsManager {

  all = {}

  add(_ws) { 
    const _id = formatId(_ws.name)
    if (_id in this.all) {
      throw new Error(`The Workspace name:'${_ws.name}', id:'${_id} '- already in used`)
    } else {
      this.all[_id] = _ws  
    }
  }

  remove(nameOrId) {
    const _id = formatId(nameOrId)
    delete this.all[_id]
  }

  get(nameOrId) {
    const _id = formatId(nameOrId)
    return this.all[_id]
  }

  save() {
    localStorage.setItem(this.name, JSON.stringify());
  }
  loadWS() {

  }

}

const WS_MANAGER = new wsManager()
export default WS_MANAGER

