
import {
  promisify,
  pivotThis,
} from '../libs/utils'


const getWindow = promisify(chrome.windows.get)
const getAllWindows = promisify(chrome.windows.getAll)


const TAB_ENUM = {
  ID: 0,
  URL: 1,
  IDX: 2,
  WIN_ID: 3,
  SEAL: 4,
}

const morphXintoY = (s1, s2) => {
  // console.log(s1, s2)
  const all_windows_id = [...new Set(s1.map((x) => x[3]))]
  const s1_dict = s1.map((x) => ({ [x[0]]: [x[0], x[1], x[2], x[3], false] }))
    .reduce((acc, val) => ({ ...val, ...acc }))
  s1_dict.future_tabs = [] // new windows that were open or modified from S1 - we dont have them in S2 so we isolate them here

  // morphing S1 into S2
  s2.forEach((tab_arr, index) => {
    const [original_tab_id, original_url, original_idx, original_win_id] = tab_arr

    // is tab in s1?
    if (!s1_dict[original_tab_id]) {
      // -1 because we want to force the checking of the window ID- some windows might have been closed
      s1_dict[original_tab_id] = [original_tab_id, original_url, original_idx, -1, false]
    }
    const [curr_tab_id, curr_url, curr_idx, curr_win_id] = s1_dict[original_tab_id]

    if (curr_url !== original_url) {
      s1_dict.future_tabs.push([curr_tab_id, curr_url, curr_idx, curr_win_id, false])
      s1_dict[original_tab_id] = [curr_tab_id, original_url, original_idx, curr_win_id, false]
    }

    if (curr_url !== original_url) {
      s1_dict.future_tabs.push([curr_tab_id, curr_url, curr_idx, curr_win_id, false])
      s1_dict[original_tab_id][TAB_ENUM.URL] = original_url
    }

    if (curr_idx !== original_idx) {
      s1_dict[original_tab_id][TAB_ENUM.IDX] = original_idx
    }

    if (curr_win_id !== original_win_id) {
      let new_win_id = original_win_id
      if (!all_windows_id.includes(original_win_id)) {
        new_win_id = `new_${original_win_id}`
      }
      s1_dict[original_tab_id][TAB_ENUM.WIN_ID] = new_win_id
    }
    s1_dict[original_tab_id][TAB_ENUM.SEAL] = true
  })
  return s1_dict
}


export default class CWindow {
  static state = []
  // static _delimiter = '|*>TS2<*|'

  static _serializeState(win_obj) {
    return {
      timeStamp: Date.now(),
      id: win_obj.id,
      tabs: win_obj.tabs.map((t) => {
        const {
          id, url, title, favIconUrl, pinned, index,
        } = t
        return {
          id, url, title, favIconUrl, pinned, index,
        }
      }),
    }
  }

  static async snapshot(id) {
    const win_obj = await getWindow(id, { populate: true })
    return CWindow._serializeState(win_obj)
  }

  static async snapshot_all() {
    const _windows = await getAllWindows({ populate: true })
    this.state.push(_windows.map((w) => this._serializeState(w)))
    console.log(this.state)
  }

  static reshapeStateToFlatTabs(state) {
    /**
       * returns {
       *   tab_id1: [t.id, t.url, t.index, w.id],
       *   tab_id2: [t.id, t.url, t.index, w.id]
       *   ....
       * }
       */
    // return state.map(w => w.tabs.map(t=> {return {[t.id]: [t.id, t.url, t.index, w.id]}} ))
    //      .flat()
    //      .reduce((acc, val) => {return {...val, ...acc}})
    return state.map((w) => w.tabs.map((t) => [t.id, t.url, t.index, w.id]))
      .flat()
    // .reduce((acc, val) => {return {...val, ...acc}})
  }

  static get_new_windows(state_dict, id_column = 3) {
    return Object.entries(pivotThis(state_dict, id_column))
      .filter((x) => x[0].startsWith('new'))
      .reduce((acc, val) => ({ ...acc, ...{ [val[0]]: val[1] } }), {})
  }

  static get_sealed_tabs(state_dict, id_column = 4) {
    return pivotThis(state_dict, id_column).true
  }

  static get_unsealed_tabs(state_dict, id_column = 4) {
    return pivotThis(state_dict, id_column).false
  }

  static async _analyse() {
    await this.snapshot_all() // save current state

    // get last 2 state -  previous (s2) and current (s1)
    const [s2, s1] = this.state.slice(-2)

    console.log(s1, s2)
    if (!(s1 && s2)) {
      console.log(`state 1 = ${s1} -- state 2 = ${s2}`)
      return 'No state found'
    }

    const _s1 = this.reshapeStateToFlatTabs(s1)
    const _s2 = this.reshapeStateToFlatTabs(s2)

    const morphed_s1 = morphXintoY(_s1, _s2)
    console.log(morphed_s1)

    console.log(this.get_sealed_tabs(morphed_s1)) // will reuse
    console.log(this.get_unsealed_tabs(morphed_s1)) // new tabs in s2 not in s1
    console.log(this.get_new_windows(morphed_s1))
    // windows needs to be rearranged

    //  tabs to be moved, created, deleted


    return {
      move: [],
      create: [],
      delete: [], // no hard close - just merge or move
    }
  }
}
