import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Courses } from "../pages";
import { createPortal } from "react-dom";

const SearchResults = () => {
  const { pattern } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const coursesFromDom = Array.from(
        document.querySelectorAll(".coursecard_course__title__HwMZa")
      );
      coursesFromDom.forEach((course) => {
        course.parentElement.style.display = "block";
      });

      if (pattern && pattern !== undefined && coursesFromDom.length !== 0) {
        let result = coursesFromDom.filter(
          (course) =>
            course.firstChild.textContent
              .toLowerCase()
              .indexOf(pattern.toLowerCase()) === -1
        );
        result.forEach((course) => {
          course.parentElement.style.display = "none";
        });
      }
      setIsLoading(false);
    }, 3000);
  }, [pattern]);
  return (
    <>
      {isLoading &&
        createPortal(
          <div className="loader">loading...</div>,
          document.getElementById("root")
        )}
      <Courses />
    </>
  );
};

export default SearchResults;
