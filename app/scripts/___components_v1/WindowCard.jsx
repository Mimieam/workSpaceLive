import React, { Fragment, useState, useEffect } from "react"
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
// import { ReactSortable, Sortable } from "react-sortablejs";
// import Sortable from 'sortablejs'
import './WindowCard.css'
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getItemStyle } from './Tabs/helpers'

export const WindowCard = ({title, tabs,...props}) => {
  // const [tabs, setTabs] = useState([]);
  console.log("tabs = ", tabs)
  useEffect(() => { })

  return (
    <Fragment>
      <div className="windowCard px-4 py-2 border-orange-800 bg-gray-200 border-solid border-r-4 rounded-lg my-2 mx-3 shadow-md">
        <div className="font-bold text-lg mb-2 border-solid border-gray-300 border-b-2 text-gray-800">Window ID = {title} </div>
        <div className="text-gray-700 text-base h-32 WCard">
          {
             tabs.map((tab, index) => (
            <Draggable
              key={tab.id}
              draggableId={`${ tab.id }`}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around"
                    }}
                  >
                    {tab.url}
                  </div>
                </div>
              )}
            </Draggable>
             ))
            }
        </div>
      </div>
    </Fragment>
  );
};
