import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { ResponseMessage, CourseInput } from "../components";
import { useLogout, useHandleData, validator, handleError } from "../js";
import "../css/addCourse.css";

const AddCourse = () => {
  const [course, setCourse] = useState({ course_title: "", course_image: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [response, setResponse] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [courseValidation, setCourseValidation] = useState({
    isValidCourseTitle: true,
    isValidCourseImage: true,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useLogout();
  const handleData = useHandleData();

  const isCourseTitleValid = () =>
    validator(course.course_title, /^[a-zA-Z0-9\s]+$/);

  const isCourseImageValid = () => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    return allowedImageTypes.includes(course.course_image?.type);
  };
  const isCourseValid = () => {
    const isValidCourseTitle = isCourseTitleValid();
    const isValidCourseImage = isCourseImageValid();

    setCourseValidation({
      isValidCourseTitle: isValidCourseTitle,
      isValidCourseImage: isValidCourseImage,
    });

    return isValidCourseTitle && isValidCourseImage;
  };

  const onAddCourse = (e) => {
    e.preventDefault();
    if (!isCourseValid()) return;
    const data = new FormData();
    data.append("course-title", course.course_title);
    data.append("course-image", course.course_image);
    courseMutation.mutate(data);
  };
  const courseMutation = useMutation({
    mutationFn: (course) =>
      handleData({
        method: "POST",
        endPoint: "course/create.php",
        data: course,
        isAuthenticated: true,
      }),
    onMutate: () => setIsUploading(true),

    onSuccess: (message) => {
      setResponse(message.success);
      setIsSuccess(true);
      queryClient.invalidateQueries("courses");
      setTimeout(() => navigate("/courses"), 2000);
    },

    onError: (error) => {
      const { errorValue } = handleError(error);
      setResponse(errorValue);
      setIsSuccess(false);
      if (error.status === 401) {
        setTimeout(() => logout(), 3000);
      }
    },

    onSettled: () => {
      setIsUploading(false);
      setTimeout(() => setResponse(""), 2000);
    },
  });

  return (
    <>
      <div
        className="grid vh-100 px-3 add-course"
        style={{
          placeContent: "center",
        }}
      >
        <form
          encType="multipart/form-data"
          onSubmit={onAddCourse}
          className="grid position-relative"
        >
          {response && (
            <ResponseMessage message={response} isSuccess={isSuccess} />
          )}
          <CourseInput
            id="course-title"
            title="course title"
            type="string"
            handleInputChange={(e) =>
              setCourse({ ...course, course_title: e.target.value })
            }
            isUploading={isUploading}
          >
            {!courseValidation.isValidCourseTitle && (
              <div className="text-danger">
                course title should contains letters,numbers or whitespaces.
              </div>
            )}
          </CourseInput>
          <CourseInput
            id="course-image"
            title="course image"
            type="file"
            handleInputChange={(e) =>
              setCourse({ ...course, course_image: e.target.files[0] })
            }
            isUploading={isUploading}
          >
            {!courseValidation.isValidCourseImage && (
              <div className="text-danger">
                Image should be of type jpeg,png or jpg.
              </div>
            )}
          </CourseInput>
          <div style={{ gridColumn: "span 12" }}>
            {!isUploading && (
              <input
                type="submit"
                value="upload"
                className="form-control p-2 blue-button"
              />
            )}
            {isUploading && (
              <button
                className="form-control p-2 blue-button"
                type="submit"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm mx-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                uploading...
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCourse;
