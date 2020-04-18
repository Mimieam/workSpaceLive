'use strict';

import https from 'https'
import stream from 'stream'
import { get, set } from './utils'


//streamToString thanks to https://stackoverflow.com/a/49428486 :)
function streamToString (stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

const updatePublicSuffixList = async (saveList=false)=>{
  console.log("Updating ....PublicSuffixList")

  return new Promise((resolve, reject) => {
    const PSL_URL = 'https://publicsuffix.org/list/effective_tld_names.dat'

    const request = https.get(PSL_URL, async (stream, err)=>{

      let buffer = await streamToString(stream)
      let publicSuffixList = buffer.split('\n')
                                   .filter( l => !(l.startsWith('//') || l ==''))
      saveList ? await set({"publicSuffixList": publicSuffixList}): null
      resolve(publicSuffixList)
    })
    request.on('error', (err) => reject(err))
  })
}

// if the url tld not registered, falls back to taking anything after the last dot
const parse = (url, registered_tld=[]) =>{
  // console.log(url)
  const url_parts = new URL(url)
  let domain = url_parts.hostname

  let domainArr = domain.split('.').reverse()
  let memoize = []

  // build the tld, by adding the last sub component and checking if it is in the registered list of tld
  // we could have multiple registered one, we will ony take the very last one.
  let res = domainArr.reduce((tld, val) =>{
    let next_tld = tld? val + '.' + tld : val
    registered_tld.includes( next_tld ) && next_tld!= domain ? memoize.push(next_tld) : ''
    return next_tld
  }, '')

  // we are done building the tld, we can reverse it back to find the other components
  domainArr.reverse()
  const _tld = memoize.pop() ||  domainArr[ domainArr.length -1]
  const tld_len = _tld ? _tld.split('.').length : 1
  domainArr.splice(-(tld_len)) // remove tld
  const _sld = domainArr.pop()
  const _subdomain = domainArr.join('.')

  return {
    tld: _tld,
    sld: _sld,
    domain: _tld ? _sld+ '.'+_tld: _sld,
    subdomain: _subdomain,
    search: url_parts.search,
    pathname: url_parts.pathname,
    protocol: url_parts.protocol.replace(":",''),
    original_url: url
  }
}


export { updatePublicSuffixList, parse }
