import React, { Fragment, useState, useEffect } from "react";
import './tabs.css'
import './../sidebar.css'
import { WindowCard } from './../WindowCard'
import browser from 'webextension-polyfill';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { move, reorder } from './helpers'


export const Pane = ({ content }) => {
  // useEffect(() => { })

  return (
    <div className="card max-w-sm fixed top-0 left-0 rounded-lg overflow-hidden shadow-lg bg-white ml-16 mr-2 my-2 bg-gray-800">
      <div className=".rounded-t-lg px-6 py-2 text-right bg-gray-800 h-10 font-bold text-gray-200 text-xl mb-2">
        WorkSpaceLive
      </div>
      {
        content.map((w, index) => {
          return (<Droppable key={ index } droppableId={ `${ index }` }>
            {(provided, snapshot) => (
              <div
                ref={ provided.innerRef }
                // style={ getListStyle(snapshot.isDraggingOver) }
                { ...provided.droppableProps }
              >
                <WindowCard title={ w.id } tabs={ w.tabs } />
                {provided.placeholder}
              </div>
            )}
          </Droppable>)
        })
      }
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
  const [allWindows, setAllWindows] = useState({ id: null, tabs: [] });
  const [state, setState] = useState([[1,2,3],[4,5,6]]);


  useEffect(() => {
    const fetchCurrentWindows = async () => {
      const windows = await browser.windows.getAll({ populate: true })
      setAllWindows(windows)
      // setState(windows)
    }  
  
    fetchCurrentWindows();
    return () => { } 
  }, [allWindows]);


  const renderHeaders = (selected) => {  
    const workspaces = [1, 2, 3, 4, 5] 
    const listOfWorkSpaceComponents = workspaces.map((value, i) => <SidebarButton key={i}  value={value} onClick={ () => onClickHandler(i) }/>);

    const onClickHandler = async (idx) => { await setSelected(idx) }

    
    return (
      <div className="sidebar ">
        { listOfWorkSpaceComponents }
        <SidebarButton key={"+"} value="+" className="add"/>
      </div>
    );
  }

  const renderContent = (selected) => {
    console.log("RenderContent - ", selected)

    function onDragEnd(result) {
      console.log(result)
      const { source, destination } = result;
  
      // dropped outside the list
      if (!destination) {
        return;
      }
      const sInd = +source.droppableId;
      const dInd = +destination.droppableId;
  
      if (sInd === dInd) {
        const items = reorder(state[sInd], source.index, destination.index);
        const newState = [...state];
        newState[sInd] = items;
        setState(newState);
      } else {
        const result = move(state[sInd], state[dInd], source, destination);
        const newState = [...state];
        newState[sInd] = result[sInd];
        newState[dInd] = result[dInd];
  
        setState(newState.filter(group => group.length));
      }
    }

    return (
      <DragDropContext onDragEnd={ onDragEnd }>
        <Pane label={ selected } content={allWindows}/>
      </DragDropContext>
    );
  }

  return (
    <Fragment>
      {renderHeaders(selected)}
      {renderContent(selected)}
    </Fragment>
  )
}