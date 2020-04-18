import React, { Component } from 'react'
import Sidebar from "./Sidebar"
import {Tabs, Pane} from './Tabs/Tabs'

export default class App extends Component {
  render() {
    return (
      <div>
        <Tabs selected={0}>
          <Pane label="Tab 1">
            <div>This is my tab 1 contents!</div>
          </Pane>
          <Pane label="Tab 2">
            <div>This is my tab 2 contents!</div>
          </Pane>
          <Pane label="Tab 3">
            <div>This is my tab 3 contents!</div>
          </Pane>
        </Tabs>
        <Sidebar />
      </div>
    )
  }
}