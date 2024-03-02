import { useMutation, useQueryClient } from "react-query";
import { useHandleData } from "../../../../js";
import settings from "../coursecard.module.css";

const DeleteButton = ({ course_id }) => {
  const handleData = useHandleData();
  const queryClient = useQueryClient();
  const deleteCourseMutation = useMutation({
    mutationFn: (data) =>
      handleData({
        method: "POST",
        endPoint: "course/deleteCourse.php",
        data: data,
        isAuthenticated: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("myCourses");
      queryClient.invalidateQueries("recommendedCourses");
    },
  });

  const onDeleteCourse = () => {
    const data = new FormData();
    data.append("course_id", course_id);
    deleteCourseMutation.mutate(data);
  };

  return (
    <button
      onClick={onDeleteCourse}
      id={course_id}
      className={`btn btn-danger rounded-4
      pt-2 pb-2 ps-3 px-3 text-capitalize`}
    >
      delete course
    </button>
  );
};
export default DeleteButton;
