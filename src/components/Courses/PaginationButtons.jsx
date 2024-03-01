import { useEffect } from "react";
import "../../css/pagebuttons.css";
const PaginationButtons = ({ number_of_pages, onPageChange }) => {
  const handlePageChange = (page_number, e) => {
    const buttons = document.querySelectorAll(".page-button");
    buttons.forEach((button) => button.classList.remove("active"));
    e.target.classList.add("active");
    onPageChange(page_number);
  };
  const buttons = [];
  for (let i = 0; i < number_of_pages; i++) {
    const page_number = i + 1;
    buttons.push(
      <button
        className="page-button"
        key={i}
        onClick={(e) => handlePageChange(page_number, e)}
      >
        {page_number}
      </button>
    );
  }
  useEffect(() => {
    const firstPage = document.querySelector(".page-button");
    firstPage?.click();
  }, []);
  return <div className="buttons-container">{buttons}</div>;
};

export default PaginationButtons;
