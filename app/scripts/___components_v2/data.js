// @flow

const tasks = Array.from({ length: 20 }, (v, k) => k).map(
  (val) => ({
    id: `task-${val}`,
    content: `Task ${val}`,
  }),
);

const taskMap = tasks.reduce(
  (previous, current) => {
    previous[current.id] = current;
    return previous;
  },
  {},
);

const todo = {
  id: 'todo',
  title: 'To do',
  taskIds: tasks.map((task) => task.id),
};

const done = {
  id: 'done',
  title: 'Done',
  taskIds: [],
};

const entities = {
  columnOrder: [todo.id, done.id],
  columns: {
    [todo.id]: todo,
    [done.id]: done,
  },
  tasks: taskMap,
};

export default entities;