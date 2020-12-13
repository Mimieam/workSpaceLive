import React, { Component } from 'react'
import './sidebar.css'

const SidebarButton = props => {
  const { className } = props
  let _className = className ? className : ''

  return (
    <div className={`${_className} sidebarButton`} onClick={ props.onClick }>
      { props.value }
    </div>
  )
  
}


export default class Sidebar extends Component {

  render() {

    const workspaces = [1,2,3,4,5] 
    const listOfWorkSpaceComponents = workspaces.map((value, i) => <SidebarButton key={i}  value={value} />);


    return (
      <div className="bg-gray-200 sidebar">
        { listOfWorkSpaceComponents }
        <SidebarButton key={"+"} value="+" className="add"/>
      </div>
    )
  }
}
