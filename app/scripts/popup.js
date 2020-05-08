'use strict';
import React from "react"
import ReactDOM from "react-dom"
// import styles from './../styles/main.css'
// import App from "./components/App"
import App from "./components/App2"
import browser from 'webextension-polyfill';
// import App from "./___components/App"

// import { h, app } from "hyperapp"
// import { observable, autorun } from "mobx"

if (chrome && chrome.extension) {

  let backgroundJS = chrome.extension.getBackgroundPage();
  let DEBUG = true;
  DEBUG && console.log("chrome", chrome.extension)
  DEBUG && console.log("Background JS - loaded ?", backgroundJS)
  DEBUG && console.log("Background JS - TS2 ?", backgroundJS.ts2)
  console = backgroundJS.console
  
  console.log("loaded");
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App/>, mountNode);


