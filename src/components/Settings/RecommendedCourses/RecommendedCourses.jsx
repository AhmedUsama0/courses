import { useQuery } from "react-query";
import { useLogout, API_BASE_URL, API_BASE_UPLOADS } from "../../../js";
import { useNavigate } from "react-router-dom";
import settings from "./recommendecourses.module.css";
const RecommendedCourses = ({ userData, onTokenExpired }) => {
  const logout = useLogout();
  const navigate = useNavigate();
  const fetchRecommendedCourses = async () => {
    const response = await fetch(
      `${API_BASE_URL}course/readRecommendedCourses.php`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );
    const recommendedCourses = await response.json();
    if (!response.ok) {
      const error = new Error(recommendedCourses.error);
      error.status = response.status;
      throw error;
    }

    return recommendedCourses;
  };
  const { data: recommendedCourses, error } = useQuery({
    queryKey: ["recommendedCourses"],
    queryFn: fetchRecommendedCourses,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 20000,
    onError: (error) => {
      if (error.status === 401) {
        onTokenExpired(error.message);
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
        {error && error.status === 404 && (
          <div className="text-primary alert alert-primary text-capitalize text-center">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedCourses;
