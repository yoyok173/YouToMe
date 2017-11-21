import { GETSTATE } from '../actions'

function performAction(state,action) {
     switch(action.type) {
          case GETSTATE:
               console.log("Action performed from the reducer");
               console.log(state,action);
               let stateVal="SEGI";
               return { stateVal };
          default
              stateVal="DEFAULT";
              return stateVal;
     }
}
