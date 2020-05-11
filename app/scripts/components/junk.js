
const getFromDomStringThis = (cssAttribute, domString) => {
  let el = document.createElement('vDom')
  el.innerHTML = domString
  let data = el.querySelector(cssAttribute)
  return data
}


const fetchThis = (url) => {
  return new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.onload = () => {
      let status = xhr.status;
      if (status == 200) {
        resolve(xhr.response)
      } else {
        reject(`${status}`)
      }
    }
    xhr.send()
  })
}



class Scrapper {

  constructor() {
    this.domString = ''
    this._dom = ''
  }
  async load(pageUrl) {
    this.domString = await fetchThis(pageUrl)
    this._dom = document.createElement('_Dom')
    this._dom.innerHTML = this.domString
  }

  get(cssSelector) {
    return this._dom.querySelector(cssSelector)
  }
  getDom() {
    return this._dom
  }
}

export default fetchThis

