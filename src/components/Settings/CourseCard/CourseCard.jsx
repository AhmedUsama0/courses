import { Link } from "react-router-dom";
import settings from "./coursecard.module.css";
import { API_BASE_UPLOADS } from "../../../js";
const CourseCard = ({ course }) => {
  return (
    <article className={settings.course}>
      <img src={`${API_BASE_UPLOADS}uploads/${course.course_image}`} alt="course" />
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
        <Link
          to={`/course/${course.id}`}
          className={`${settings.view__course} text-capitalize`}
        >
          view course
        </Link>
      </div>
    </article>
  );
};

export default CourseCard;
