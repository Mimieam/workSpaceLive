import React, { Fragment, useState, useEffect } from "react";
import './tabs.css'
import './../sidebar.css'
import { WindowCard } from './../WindowCard'
import { ReactSortable } from 'react-sortablejs'
import {Sortable, AutoScroll} from 'sortablejs'

export const Pane = props => {

  useEffect(() => {
    // Update the document title using the browser API
    // const elements = Array.from(document.querySelectorAll('.windowCards'))

    // elements.map(el => {
    //   Sortable.create(el, {
    //     group: {
    //       name: 'disable-group-name',
    //       // put: false,
    //       // pull: 'clone'
    //     },
    //     fallbackOnBody: true,
    //     easing: "cubic-bezier(1, 0, 0, 1)",
    //     // swapThreshold: 0.65,
    //     animation: 50,
    //     ghostClass: 'ghost-background-class',
    //     scroll: true, // Enable the plugin. Can be HTMLElement.
    //     scrollSensitivity: 200, // px, how near the mouse must be to an edge to start scrolling.
    //     scrollSpeed: 10, // px, speed of the scrolling
    //     bubbleScroll: true
    //   })
    // })
  })

  return (
    <div className="card max-w-sm fixed top-0 left-0 rounded-lg overflow-hidden shadow-lg bg-white ml-16 mr-2 my-2 bg-gray-800">
      <div className=".rounded-t-lg px-6 py-2 text-right bg-gray-800 h-10 font-bold text-gray-200 text-xl mb-2">
          WorkSpaceLive 
      </div>
      {/* <ReactSortable
        fallbackOnBody={ true}
        easing={ "cubic-bezier(1, 0, 0, 1)"}
        // swapThreshold={ 0.65,}
        animation={ 50}
        ghostClass={ 'ghost-background-class'}
        scroll={ true}
        scrollSensitivity={ 200 }
        scrollSpeed={ 10 }
        bubbleScroll={ true}
        className={"windowCards"}> */}
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
          <WindowCard {...props}/>
        {/* </ReactSortable> */}
    </div>
  )
}


const SidebarButton = props => {
  const { className } = props
  let _className = className ? className : ''

  return (
    <div className={`${_className} sidebarButton`} onClick={ props.onClick }>
      { props.value }
    </div>
  )
}



export const Tabs = props => {
  const [selected, setSelected] = useState(0);
  const [currentPane, setCurrentPane] = useState(0);

  const workspaces = [1, 2, 3, 4, 5] 
  const listOfWorkSpaceComponents = workspaces.map((value, i) => <SidebarButton key={i}  value={value} onClick={ () => onClickHandler(i) }/>);

  const onClickHandler = async (idx) => {
    await setSelected(idx)
  }

  const renderHeaders = (selected) => {
    return (
      <div className="sidebar ">
        { listOfWorkSpaceComponents }
        <SidebarButton key={"+"} value="+" className="add"/>
      </div>
    );
  }

  const renderContent = (selected) => {
    console.log("RenderContent - ", selected)
    return (
      <Pane label={ selected } content={[]}/>
    );
  }

  return (
    <Fragment>
      {renderHeaders(selected)}
      {renderContent(selected)}
    </Fragment>
  )
}




  // let  ws = {
  //   id:"",
  //   name: "",
  //   dimension: {
  //     top, left, width, height
  //   },
  //   tabs: [{
  //     id:"",
  //     url:"",
  //     title:""
  //   }]
  // }