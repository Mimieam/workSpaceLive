import React, { Component } from 'react'
import Sidebar from "./Sidebar"
import {Tabs, Pane} from './Tabs/Tabs'

export default class App extends Component {
  render() {
    return (
      <div>
        {/* <Sidebar /> */}
        <Tabs selected={0}>
          <Pane label="1">
            <div>This is my tab 1 contents!</div>
          </Pane>
          <Pane label="2">
            <div>This is my tab 2 contents!</div>
          </Pane>
          <Pane label="3">
            <div>This is my tab 3 contents!</div>
          </Pane>
        </Tabs>
      </div>
    )
  }
}