import { useContext } from 'react';
import Context from '~/context/AuthProvider';

function useAuth() {
    return useContext(Context);
}

export default useAuth;