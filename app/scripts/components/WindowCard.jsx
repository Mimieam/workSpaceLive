import React, { Fragment, useState, useEffect } from "react"
// import { ReactSortable, Sortable } from "react-sortablejs";
import Sortable from 'sortablejs'
import './WindowCard.css'


export const WindowCard = props => {
  const [state, setState] = useState([
    { id: "1", name: "shrek" },
    { id: "2", name: "shrek2" },
    { id: "3", name: "shrek3" },
    { id: "4", name: "shrek4" },
    { id: "5", name: "shrek5" },
  ]);

  useEffect(() => {
    // Update the document title using the browser API
    const elements = Array.from(document.querySelectorAll('.WCard'))

    elements.map(el => {
      Sortable.create(el, {
        group: {
          name: 'shared',
          // pull: 'clone'
        },
        animation: 150
      })
    })
  })

  return (
    <Fragment>
      <div className="windowCard px-4 py-2 border-orange-800 bg-gray-200 border-solid border-r-4 rounded-lg my-2 mx-3 shadow-md">
        <div className="font-bold text-lg mb-2 border-solid border-gray-300 border-b-2 text-gray-800">Window X </div>
        <div className="text-gray-700 text-base h-32 WCard">
          { props.children }
          {
             state.map(item => (
              <div key={ item.id }>{ item.name }</div>
             ))
          }
        </div>
      </div>
    </Fragment>
  );
};
