export const GETSTATE = "GETSTATE"

export function getState(str) {
     const action = {
          type: GETSTATE,
          str
     };

     return action;
}
