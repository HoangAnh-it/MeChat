import { createContext, useState } from 'react';

const Context = createContext();

export default Context;

export const ConfirmModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [action, setAction] = useState(() => () => { });

    const open = () => {
        setIsOpen(true);
    }

    const close = () => {
        setIsOpen(false);
    }

    const init = (title = '', description ='', action = () => { }) => {
        if (title) {
            setTitle(title);
        }

        if (description) {
            setDescription(description);
        }

        if (action) {
            setAction(() => action);
        }
    }

    return (
        <Context.Provider value={[init, open, close, { isActive: isOpen, title, description,action }]}>
            {children}
        </Context.Provider>
    )
}