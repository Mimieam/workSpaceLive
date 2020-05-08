import React, { Component } from 'react'
import Sidebar from "./Sidebar"
import { Tabs, Pane } from './Tabs/Tabs'
import { ReactSortable } from "react-sortablejs";

export default class App extends Component {
  render() {
    return (
        <Tabs selected={0}>
        </Tabs>
    )
  }
}