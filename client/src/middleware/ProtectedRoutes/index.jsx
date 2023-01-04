import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth, useAxios, useSocket} from '~/hooks';
import routes from '~/config/routes';
import api from '~/config/api';
import Loading from '~/components/Loading';
import Header from '~/components/Header';

function ProtectedRoutes() {
    console.log('ProtectedRoutes')
    const [auth, authDispatch, authActions] = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const axios = useAxios()
    const [socket, socketEvents] = useSocket()


    useEffect(() => {
        const checkAuth = () => {
            if (auth.isLoggedIn) {
                socket.emit(socketEvents.JOIN_ROOM, auth.user.id);
                setLoading(false);
                return
            }
            axios.post(api.authenticate)
                .then((response) => {
                if (response.statusText === 'OK') {
                        socket.emit(socketEvents.JOIN_ROOM, response.data.user.id);
                        authDispatch(authActions.loggedIn(response.data))
                        setLoading(false)
                    }
                })
                .catch(error => {
                    console.log(error);
                    navigate(routes.public.login, { replace: true });
                })
        }

        checkAuth();
    }, [])

    return (
        loading ?
            <Loading />
            :
            <>
                <Header />
                <Outlet />
            </>
    )
}

export default ProtectedRoutes;