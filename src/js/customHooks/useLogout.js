import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../store/store";
import { logout as logoutAction } from "../../store/store";


const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        dispatch(logoutAction());
        await persistor.purge();
        navigate("/");
    }

    return logout;
}

export default useLogout;