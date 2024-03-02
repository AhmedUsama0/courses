import { useQuery } from "react-query";
import {
  useLogout,
  API_BASE_UPLOADS,
  handleError,
  useHandleData,
} from "../../../js";
import { useNavigate } from "react-router-dom";
import settings from "./recommendecourses.module.css";
import { useState } from "react";
const RecommendedCourses = () => {
  const logout = useLogout();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleData = useHandleData();
  const { data: recommendedCourses } = useQuery({
    queryKey: ["recommendedCourses"],
    queryFn: () =>
      handleData({
        method: "GET",
        endPoint: "course/readRecommendedCourses.php",
        isAuthenticated: true,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 20000,
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
  return (
    <div className={`${settings.recommended__courses} mt-4 px-2 ps-2`}>
      <header className="row">
        <h3 className="text-capitalize col">recommended courses</h3>
      </header>
      <div className={`${settings.courses} mt-3`}>
        {recommendedCourses &&
          recommendedCourses.map((course, index) => (
            <div
              className={`${settings.box} px-3 ps-3 pt-3 pb-3 rounded-5 text-white mb-2`}
              key={index}
            >
              <div className="d-flex align-items-center gap-4">
                <div className="hstack gap-3 flex-fill">
                  <img
                    src={`${API_BASE_UPLOADS}uploads/${course.course_image}`}
                    className="rounded-3"
                    alt="course"
                  />
                  <h3 className="fs-5">{course.course_name}</h3>
                </div>
                <div
                  className={`${settings.course__info} p-3 rounded-2 d-none d-sm-block`}
                >
                  <span>{course.course_date}</span>
                  <span className="ms-2 mx-2">|</span>
                  <span>{course.course_likes} likes</span>
                </div>
                <i
                  className="fa-solid fa-arrow-right-long fa-beat fs-3"
                  role="button"
                  onClick={() => navigate(`/course/${course.id}`)}
                ></i>
              </div>
            </div>
          ))}
        {error && (
          <div className="text-primary alert alert-primary text-capitalize text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedCourses;
