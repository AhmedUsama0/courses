import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Courses } from "../pages";

const SearchResults = () => {
  const { pattern } = useParams();
  useEffect(() => {
    const courses = Array.from(document.querySelectorAll(".course-title"));
    courses.forEach((course) => {
      if (
        course.firstChild.textContent
          .toLowerCase()
          .indexOf(pattern.toLowerCase()) !== -1
      ) {
        course.parentElement.style.display = "block";
      } else {
        course.parentElement.style.display = "none";
      }
    });
  }, [pattern]);
  return (
    <>
      <Courses />
    </>
  );
};

export default SearchResults;
