
export const promisify = (fn) => (...args) => new Promise((resolve, reject) => {
  fn(...args, (value, error) => {
    if (error) {
      reject(error);
    } else {
      resolve(value);
    }
  });
});

// fake data generator
export const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export  const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: `4px`,
  margin: `0 0 1px 0`,
  font: `1em`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

export  const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: '2px',
  width: '100%',
  marginBottom: '5px' 
});


/**
 * Moves an item from one list to another list.
 */
export  const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  console.log( result )
  return result;
};
