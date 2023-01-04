import { useContext } from 'react';
import EditModalContext from '~/context/EditModalProvider';

function useEditModal() {
    return useContext(EditModalContext)
}

export default useEditModal;