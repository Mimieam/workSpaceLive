import React from "react";
import globalHook from 'use-global-hook';

const initialState = {
  counter: 0,
  entities: [],
  selectedTaskIds: [],
  draggingTaskId: null,
};

const actions = {
  addToCounter: (store, amount) => {
    const newCounterValue = store.state.counter + amount;
    store.setState({ counter: newCounterValue });
  },
};

export default globalHook(React, initialState, actions);
