import { useState } from "react";
import { useSelector } from "react-redux";
import {
  MyCourses,
  RecommendedCourses,
  LeftSideBar,
  RightSideBar,
  ResponseMessage,
} from "../components";

const Dashboard = () => {
  const { user: userData } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  return (
    <>
      {errorMessage && <ResponseMessage message={errorMessage} />}
      <div
        className={`container-fluid p-0`}
        style={{ height: "calc(100vh - 66px)" }}
      >
        <div className="row h-100">
          <LeftSideBar />

          <div className="dashboard pt-2 pb-2 col-12 col-md-7 border-right border d-flex flex-column">
            <MyCourses userData={userData} />
            <RecommendedCourses
              userData={userData}
              onTokenExpired={(error) => setErrorMessage(error)}
            />
          </div>

          <RightSideBar userData={userData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
