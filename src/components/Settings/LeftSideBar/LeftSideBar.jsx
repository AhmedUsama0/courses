import settings from "./leftsidebar.module.css";
import { useLogout } from "../../../js";
const LeftSideBar = () => {
  const logout = useLogout();
  return (
    <div className={`col border-right border p-0 ${settings.left_sidebar}`}>
      <div className={`container-md h-100 p-2 p-md-0`}>
        <input type="checkbox" id="menu_icon" hidden />
        <label
          htmlFor="menu_icon"
          className={`cursor-pointer d-sm-block d-md-none fs-3 m-2`}
        >
          <i className="fa-solid fa-bars" style={{ cursor: "pointer" }}></i>
        </label>
        <div
          className={`${settings.menu} h-100 d-flex flex-column justify-content-center`}
        >
          <ul
            className={`p-0 mb-0 flex-fill d-flex  justify-content-center flex-column gap-5 text-center`}
          >
            <li className={`text-capitalize fs-5 ${settings.active}`}>dashboard</li>
          </ul>
          <li
            className={`text-capitalize text-center fs-6 ${settings.logout}`}
            onClick={logout}
          >
            logout
          </li>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
