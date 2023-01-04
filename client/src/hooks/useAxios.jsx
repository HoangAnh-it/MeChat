import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '~/hooks';
import routes from '~/config/routes';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    withCredentials: true,
    headers: {
        // 'Content-Type': 'application/'
    }
    // timeout: 3000,
})

const usePrivateAxios = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();
    const {id} = auth.user;

    /* FIX Token is already in auth State to get.
        but when just open app, auth is empty,
        So we need to get token from Cookie and How to get Token from cookie?
    */
    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use((config) => {
            if (!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
            }
            return config;
        }, (err) => {
            return Promise.reject(err);
        })

        const responseIntercept = axios.interceptors.response.use((response) => {
            if (response.status === 403) {
                return navigate(routes.public.login, { replace: true })
            }
            return response;
        }, (err) => {
            return Promise.reject(err);
        })

        return () => {
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(responseIntercept)
        }
    }, [id]);

    return instance;
}

export default usePrivateAxios;
