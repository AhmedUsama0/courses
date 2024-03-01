import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom"

const AuthenticatedRoutes = () => {

    const {user: userData} = useSelector(state => state.user);
    const location = useLocation();
    const routeName = location.pathname;
    const isAuthenticated = Boolean(userData.isAuthenticated);
    const role = userData.role;

    // remember to find a way to prevent access to add episode component for students
    if (isAuthenticated === true && (routeName === "/add-course") && role === "student") {
        return <Navigate to="/home" />
    }
    if (isAuthenticated === true && (routeName !== "/" && routeName !== "/register")) {
        return <Outlet />
    }

    else if (isAuthenticated === true && (routeName === "/" || routeName === "/register")) {
        return <Navigate to="/home" />
    }

    else if (isAuthenticated === false && (routeName === "/" || routeName === "/register")) {
        return <Outlet />
    }

    return <Navigate to="/" />
}

export default AuthenticatedRoutes;