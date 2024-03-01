import { UploadImage } from "../../../components";
const RightSideBar = ({ userData }) => {
  return (
    <div className="right-sidebar col">
      <div className="container p-4 h-100">
        <div className="personal-info bg-dark rounded-3 p-3">
          <UploadImage  userData={userData}/>
          <h3 className="text-capitalize text-white text-center">
            {userData.username}
          </h3>
          <span className="text-white d-block text-center text-capitalize">
            {`verfied ${userData.role}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
