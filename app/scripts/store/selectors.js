import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const Action = {
  state: atomKey,
  action: () => { }
}


const inputState = selector({
  key: "inputCount",
  get: ({ get }) => get(doubleCountState),
  set: ({ set }, newValue) => set(countState, newValue),
});


createSelectors = {
  useRecoilState(inputState);
}

