import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_UPLOADS, useLogout } from "../js";
import "../css/header.css";
const Header = () => {
  const navigate = useNavigate();
  const { user: userData } = useSelector((state) => state.user);
  const logout = useLogout();
  const search = () => {
    const searchValue = document.querySelector("input[type='search']").value;
    if (searchValue) navigate(`/searchresults/${searchValue}`);
  };

  return (
    <div className="d-flex flex-column">
      <header className="grid header">
        <div className="logo">
          <Link to="/home">rich your mind</Link>
        </div>
        <div className="search">
          <input type="search" placeholder="Search Courses" />
          <div className="search-icon" onClick={search}>
            <i className="fa fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="user">
          {/* dropdown-toggle */}
          <div
            className="d-flex justify-content-center align-items-center gap-2 dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              className="user__image"
              alt="user_image"
              src={`${API_BASE_UPLOADS}uploads/${userData.image}`}
            />

            <span className="user-name">{userData.username}</span>
          </div>
          {/* dropdown-toggle */}

          {/* dropdown-menu */}
          <ul className="dropdown-menu">
            {userData.role === "teacher" && (
              <li>
                <Link
                  className="dropdown-item text-capitalize"
                  to="/add-course"
                >
                  add course
                </Link>
              </li>
            )}
            <li>
              <Link to="/settings" className="dropdown-item text-capitalize">
                settings
              </Link>
            </li>
            <li className="dropdown-item text-capitalize" onClick={logout}>
              logout
            </li>
          </ul>
          {/* dropdown-menu */}
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default Header;
