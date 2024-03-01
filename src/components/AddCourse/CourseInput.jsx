const CourseInput = ({ title, isUploading, type,id, handleInputChange,children }) => {

  return (
    <div style={{ gridColumn: "span 12" }}>
      <label htmlFor={id} className="d-block mb-2 text-capitalize">
        {title}
      </label>
      <input
        disabled={isUploading}
        onChange={handleInputChange}
        type={type}
        className="form-control"
        id={id}
      />
      {children}
    </div>
  );
};

export default CourseInput;
