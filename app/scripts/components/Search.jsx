import React from 'react';

export class NanoFuzz {
    constructor(dataSet, options) {
        this.dataSet = dataSet
        this.options = { keys: [{ name: 'title', weight: 0.8 }, { name: 'url', weight: 0.2 }], shouldSort: true, caseSensitive: false, threshold: 0.5 }
        this._fuse_engine = new Fuse(this.dataSet, this.options)
    }
    search =(targetStr) => this._fuse_engine.search(targetStr)

    addToDataSet =(data) => {
        this.dataSet.push(data)
        this._fuse_engine.setCollection(this.dataSet)
    }
    removeById = (id) => this._fuse_engine.setCollection(this.dataSet.filter(item => item.id != id))

    onInputHandler = async (ev) => {
        this.currentInputValue = ev.target.value

        if (!this.currentInputValue){
            return false;
        }
        let results = this.nFuse.search(this.currentInputValue)
        results.splice(this.display_last_x_results) // remove everything after the first X items
        // console.log(ev.target.value, results)
        let resultHTML =
            `<div style="${this._style}" class="${this._className.join(' ')}">
               ${
                   results.map(data => {
                    return "<div>"+ data.url + "</div>"
                   }).join('\n')
                }
            </div>`

        this.displayElement.innerHTML = resultHTML
    }
}

export let nFuse = new NanoFuzz(dataSet)

export const SearchBar = (props) => {

  return (
     <div className={}>

     </div>
  )
}
