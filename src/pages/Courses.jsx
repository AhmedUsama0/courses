import { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  PaginationButtons,
  SideBar,
  ResponseMessage,
  CourseCard,
} from "../components";
import { useLogout, useHandleData, handleError } from "../js";
import courses from "../css/courses.module.css";
import CourseCardSkeleton from "../components/CourseCardSkeleton";

const Courses = () => {
  const logout = useLogout();
  const handleData = useHandleData();
  const [page, setPage] = useState(1);
  const [allCourses, setAllCourses] = useState(null);
  const [error, setError] = useState(null);

  const abortController = new AbortController();
  const { signal } = abortController;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["courses", page],
    queryFn: () =>
      handleData({
        method: "GET",
        endPoint: `course/readCourses.php?page=${page}`,
        isAuthenticated: true,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 20000,
    keepPreviousData: true,
    signal: signal,
    onSuccess: (data) => setAllCourses([...data.courses]),
    onSettled: () => abortController.abort(),
    onError: (error) => {
      const { errorValue } = handleError(error);
      setError(errorValue);
      if (error.status === 401) setTimeout(() => logout(), 1500);
    },
  });
  useEffect(() => {
    refetch();
  }, [page, refetch]);
  if (isLoading) {
    return (
      <div className={`${courses.wrapper} grid`}>
        <SideBar />
        <div className={`${courses.courses__container}`}>
          <h2>courses</h2>
          <div className={`${courses.courses} grid`}>
            {Array(4)
              .fill(1)
              .map((number, index) => {
                return <CourseCardSkeleton key={index} />;
              })}
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    return <ResponseMessage message={error} isSuccess={false} />;
  }
  return (
    <Fragment>
      {allCourses && (
        <div className={`${courses.wrapper} grid`}>
          <SideBar
            courses={[...allCourses]}
            onSortedCourses={(sortedCourses) =>
              setAllCourses([...sortedCourses])
            }
          />
          <div className={`${courses.courses__container}`}>
            <h2>courses</h2>
            <div className={`${courses.courses} grid`}>
              {allCourses?.map((course, index) => {
                return <CourseCard course={course} key={index} />;
              })}
            </div>
            <PaginationButtons
              number_of_pages={data.number_of_pages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Courses;
