'use strict';
import browser from 'webextension-polyfill';

import React from "react"
import ReactDOM from "react-dom"
// import styles from './../styles/main.css'
import App from "./components/App"
// import browser from 'webextension-polyfill';

import { RecoilRoot } from 'recoil';

// import App from "./___components/App"

// import { h, app } from "hyperapp"
// import { observable, autorun } from "mobx"

if (browser && browser.extension) {

  let backgroundJS = browser.extension.getBackgroundPage();
  let DEBUG = true;
  DEBUG && console.log("browser", browser.extension)
  DEBUG && console.log("Background JS - loaded ?", backgroundJS)
  DEBUG && console.log("Background JS - TS2 ?", backgroundJS.ts2)
  console = backgroundJS.console

  console.log("loaded");
}

var mountNode = document.getElementById("app");
ReactDOM.render(
  <RecoilRoot>
    <App/>
  </RecoilRoot>
  , mountNode);


