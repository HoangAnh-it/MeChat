import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import Login from '~/pages/public/Login';
import Signup from '~/pages/public/Signup';
import Home from '~/pages/private/Home';
import Profile from '~/pages/private/Profile';

import ProtectedRoutes from '~/middleware/ProtectedRoutes';
import routes from '~/config/routes';
import Friends from '~/pages/private/Friends';

const initRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.public.login} exact element={<Login />} />
                <Route path={routes.public.signup} exact element={<Signup />} />

                <Route path={routes.private.base} exact element={<ProtectedRoutes />}>
                    <Route path={routes.private.home} exact element={<Home />} />
                    <Route path={routes.private.chat} exact element={<Home />} />
                    <Route path={routes.private.profile} exact element={<Profile />} />
                    <Route path={routes.private.friends} exact element={<Friends />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default initRoutes