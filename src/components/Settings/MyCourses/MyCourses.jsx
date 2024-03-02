import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { CourseCard, DeleteButton } from "../../../components";
import { useLogout, useHandleData, handleError } from "../../../js";
import settings from "./mycourses.module.css";
const MyCourses = ({ userData }) => {
  const logout = useLogout();
  const [error, setError] = useState(null);
  const slider = useRef(null);
  const handleData = useHandleData();
  const decodedToken = atob(userData.token);
  const user_id = JSON.parse(
    decodedToken.slice(0, decodedToken.length - 5)
  ).user_id;

  const { data: courses } = useQuery({
    queryKey: ["myCourses", user_id],
    queryFn: () =>
      handleData({
        method: "GET",
        endPoint: "course/readMyCourses.php",
        isAuthenticated: true,
      }),
    staleTime: 20000,
    refetchOnWindowFocus: false,
    retry: false,
    onError: (error) => {
      const { errorValue } = handleError(error);
      setError(errorValue);
      if (error.status === 401) {
        setTimeout(() => {
          logout();
        }, 3000);
      }
    },
  });
  const scrollTo = (direction) => {
    const courseWidth = document.querySelector(
      ".coursecard_course__gWxF3"
    )?.clientWidth;
    const windowWidth = window.innerWidth;

    if (direction === "right" && windowWidth <= "500")
      slider.current.scrollLeft += courseWidth;
    else if (direction === "left" && windowWidth <= "500")
      slider.current.scrollLeft -= courseWidth;
    else if (direction === "right")
      slider.current.scrollLeft += courseWidth * 3;
    else if (direction === "left") slider.current.scrollLeft -= courseWidth * 3;
  };
  return (
    <div className="my-courses px-2 ps-2 flex-fill">
      <header className="row">
        <h3 className="text-capitalize col">my courses</h3>
        <div className="scroll-buttons justify-content-end d-flex gap-1 col">
          <button
            className="btn btn-secondary text-capitalize fs-5"
            id="prev"
            onClick={() => scrollTo("left")}
          >
            prev
          </button>
          <button
            className="btn btn-primary text-capitalize fs-5"
            id="next"
            onClick={() => scrollTo("right")}
          >
            next
          </button>
        </div>
      </header>
      <div className="courses mt-3">
        <div className={settings.slider} ref={slider}>
          {courses &&
            courses.map((course, index) => (
              <CourseCard course={course} key={index}>
                <DeleteButton course_id={course.id} />
              </CourseCard>
            ))}
        </div>
        {error && (
          <div className="text-primary alert alert-primary text-center text-capitalize">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
