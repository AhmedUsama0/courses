import settings from "./Settings/CourseCard/coursecard.module.css";

const CourseCardSkeleton = () => {
  return (
    <article className={settings.course}>
      <div className="placeholder-glow">
        <div className="placeholder card-img-top" style={{height: "300px"}}></div>
      </div>
      <div className={`${settings.course__title}`}>
        <h3 className="placeholder-glow">
          <span className="placeholder col-6"></span>
        </h3>
        <div className="placeholder-glow">
          <span className="placeholder col-8"></span>
        </div>
        <a
          href="#"
          className={`${settings.view__course} text-capitalize disabled placeholder`}
        >
          view course
        </a>
      </div>
    </article>
  );
};

export default CourseCardSkeleton;
