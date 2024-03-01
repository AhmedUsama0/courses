import { useEffect, useRef, useState } from "react";
import "../../css/sidebar.css";
const SideBar = ({ courses, onSortedCourses }) => {
  const currentDisplay = useRef(null);
  const [activeElement, setActiveElement] = useState(null);
  const sortCourses = (sort_type) => {
    let sortedCourses = [];
    switch (sort_type) {
      case "popular":
        sortedCourses = courses?.sort(
          (a, b) => b.course_likes - a.course_likes
        );
        setActiveElement(1);
        break;
      case "courses":
        sortedCourses = courses?.sort((a, b) => a.id - b.id);
        setActiveElement(2);
        break;
      case "new":
        sortedCourses = courses?.sort((a, b) => b.id - a.id);
        setActiveElement(3);
        break;
      default:
        sortedCourses = courses?.sort((a, b) => a.id - b.id);
        setActiveElement(2);
    }
    if (sortedCourses) {
      onSortedCourses(sortedCourses);
    }
  };

  useEffect(() => {
    currentDisplay.current?.click();
  }, []);
  return (
    <aside className="sidebar">
      <input type="checkbox" id="bars" />
      <label htmlFor="bars" className="bars">
        <i className="fa fa-bars" role="button"></i>
      </label>
      <ul>
        <li
          ref={currentDisplay}
          className={activeElement === 2 ? "active" : ""}
          onClick={(e) => sortCourses("courses", e)}
        >
          courses
        </li>
        <li
          className={activeElement === 1 ? "active" : ""}
          onClick={(e) => sortCourses("popular", e)}
        >
          popular courses
        </li>
        <li
          className={activeElement === 3 ? "active" : ""}
          onClick={(e) => sortCourses("new", e)}
        >
          new courses
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
