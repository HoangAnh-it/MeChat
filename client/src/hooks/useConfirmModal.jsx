import {useContext} from 'react';

import Context from '~/context/ConfirmModalProvider';

function useConfirmModal() {
    return useContext(Context);
}

export default useConfirmModal;