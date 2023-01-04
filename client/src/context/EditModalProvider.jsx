import { createContext } from 'react';

const Context = createContext();

export default Context;

export const EditModalProvider = ({children}) => {

    return (
        <Context.Provider value={[]}>
            { children }
        </Context.Provider>
    )
}