// 'use strict';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';

import React from "react"
import App from "./components/App.jsx"
// import browser from 'webextension-polyfill';

import { RecoilRoot } from 'recoil';
import './../styles/main.css'

// import App from "./___components/App"

// import { h, app } from "hyperapp"
// import { observable, autorun } from "mobx"

// if (browser && browser.extension) {
// }

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <RecoilRoot>
    <App/>
  </RecoilRoot>
)
