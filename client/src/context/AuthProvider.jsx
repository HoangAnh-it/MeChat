import { createContext, useReducer } from 'react';
import { reducer, initialState, actions } from '~/store/auth';
const Context = createContext();

export default Context;

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch, actions]}>
            { children }
        </Context.Provider>
    )
}