import { Link } from "react-router-dom";
import settings from "./coursecard.module.css";
import { API_BASE_UPLOADS } from "../../../js";
const CourseCard = ({ course, children }) => {
  return (
    <article className={settings.course}>
      <img
        src={`${API_BASE_UPLOADS}uploads/${course.course_image}`}
        alt="course"
      />
      <div className={`${settings.course__title}`}>
        <h3>{course.course_name}</h3>
        <div className={`${settings.course__info}`}>
          <span className="no-lessons">
            {course.number_of_episodes_per_course} lessons
          </span>
          <span>|</span>
          <span className="no-hours">
            {(course.course_duration / 3600).toFixed(1)} hours
          </span>
        </div>
        <div className="mt-4 row gap-2">
          <Link
            to={`/course/${course.id}`}
            className={`${settings.view__course} btn rounded-4
            pt-2 pb-2 ps-3 px-3 text-capitalize text-white text-decoration-none w-100`}
          >
            view course
          </Link>
          {children}
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
