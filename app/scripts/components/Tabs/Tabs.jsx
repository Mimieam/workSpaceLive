import React, { Component, useState } from 'react'
import './tabs.css'
import './../sidebar.css'

export const Pane = props => {
  return (
  <div className="card max-w-sm fixed top-0 left-0 rounded-lg overflow-hidden shadow-lg  bg-white ml-16 mr-2 my-2 h-90">
    <div className=".rounded-t-lg px-6 py-2 text-right bg-gray-800 h-10 font-bold text-gray-200 text-xl mb-2">
        Tab Header
    </div>
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">Tabs Header</div>
    <div className="text-gray-700 text-base">
    { props.children }
    </div>
  </div>
  <div className="px-6 py-4">
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#finance</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#reseach</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#life</span>
  </div>
</div>
)
}
 {/* <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  { props.children } */}


export const PaneHeader = props => {
  const { child, index, selected } = props
  const activeClass = (selected === index ? 'active' : '');

  console.log(props)
  return (
    <li className={ `${activeClass} sidebarButton` } onClick={ props.onClick}>
      <div> {child.props.label} </div>
    </li>
  )
}


export const Tabs = props => {
  const [selected, setSelected] = useState(0);
  // const headersComponents = props.children.map(PaneHeader.bind(this))
  
  const headersComponents = props.children.map((value, i) => <PaneHeader key={ i } child={ value } onClick={ () => onClickHandler(i) }/>);
  
  const onClickHandler = async (idx) => {
    await setSelected(idx)
    console.log(selected)
  }

  const renderHeaders = () => {
    console.log(props)
    return (
      <div className="flex flex-col">
        <ul> { headersComponents } </ul>
        <div className={`add sidebarButton`} onClick={ props.onClick }>
          +
        </div>
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div> {props.children[selected]} </div>
    );
  }

  return (
    <div className="bg-gray-200 sidebar  my-2 h-90">
      {renderHeaders()}
      {renderContent()}
    </div>
  )
}
