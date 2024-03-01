import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ResponseMessage } from "../components";
import { handleError, useHandleData } from "../js";
import { useMutation } from "react-query";
const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [response, setResponse] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const handleData = useHandleData();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const registerMutation = useMutation({
    mutationFn: (userData) =>
      handleData({
        method: "POST",
        endPoint: "user/register.php",
        data: userData,
        isAuthenticated: false,
      }),
    onSuccess: (message) => {
      setIsSuccess(true);
      setResponse(message.success);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error) => {
      const { errorObject } = handleError(error);
      setIsSuccess(false);
      setResponse({ ...errorObject });
    },
    onSettled: (data, error) => {
      const { errorName } = handleError(error);
      if (
        errorName === "networkError" ||
        errorName === "serverError" ||
        errorName === "invalidData"
      ) {
        setTimeout(() => setResponse(""), 2000);
      }
    },
  });
  const handleRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.target;

    form.classList.add("was-validated");

    if (!form.checkValidity()) return;

    const userData = new FormData();
    userData.append("username", user.username);
    userData.append("email", user.email);
    userData.append("password", user.password);
    userData.append("role", user.role);
    userData.append("image", user.image);

    registerMutation.mutate(userData);
  };
  return (
    <div className="background">
      <div className="container grid">
        {response.invalidData && (
          <ResponseMessage
            message={response.invalidData}
            isSuccess={isSuccess}
          />
        )}
        <div className="register__header">
          <h1>Get Started</h1>
          <p>Create your account now</p>
        </div>
        <form onSubmit={handleRegister} noValidate>
          <div className="mb-3">
            <label
              htmlFor="username"
              className="form-label text-capitalize text-secondary"
            >
              username
            </label>
            <input
              className="form-control"
              type="string"
              id="username"
              name="username"
              pattern="^[A-Z][a-z0-9]{3,8}$"
              minLength="3"
              maxLength="8"
              onChange={handleInputChange}
              required
            />
            <div className="text-danger invalid-feedback text-capitalize">
              invalid username. username must start with capital letter followed
              by letters or numbers and be 3-7 in length.
            </div>
            {response?.usernameError && (
              <div
                className="text-danger text-capitalize"
                style={{ fontSize: "0.875em" }}
              >
                {response?.usernameError}
              </div>
            )}
            <div className="valid-feedback text-capitalize">looks good</div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label text-capitalize text-secondary"
            >
              email
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              pattern="^[a-zA-Z][a-zA-Z0-9%._+]+@[a-zA-Z]+\.[a-zA-Z]+$"
              onChange={handleInputChange}
              required
            />
            <div className="invalid-feedback text-capitalize">
              invalid email format.
            </div>
            {response?.emailError && (
              <div
                className="text-danger text-capitalize"
                style={{ fontSize: "0.875em" }}
              >
                {response?.emailError}
              </div>
            )}
            <div className="valid-feedback text-capitalize">looks good</div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label text-capitalize text-secondary"
            >
              Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              onChange={handleInputChange}
              pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*\(\)\[\]\.\?]{8,}$"
              minLength="8"
              required
            />
            <div className="invalid-feedback text-capitalize">
              password is invalid. password should contains at least one capital
              letter, one special character,one digit and 8 in length.
            </div>
            {response?.passwordError && (
              <div
                className="text-danger text-capitalize"
                style={{ fontSize: "0.875em" }}
              >
                {response?.passwordError}
              </div>
            )}
            <div className="valid-feedback text-capitalize">looks good</div>
          </div>
          <div className="form-check form-check-inline mb-3">
            <label
              htmlFor="student"
              className="text-capitalize form-check-label"
            >
              student
            </label>
            <input
              type="radio"
              name="role"
              value="student"
              id="student"
              className="form-check-input"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-check form-check-inline mb-3">
            <label
              htmlFor="teacher"
              className="text-capitalize form-check-label"
            >
              teacher
            </label>
            <input
              type="radio"
              name="role"
              value="teacher"
              id="teacher"
              className="form-check-input"
              onChange={handleInputChange}
              required
            />
          </div>
          <input type="submit" value="Sign Up" className="btn btn-primary" />
        </form>
        <p className="login">
          have an account?<Link to="/">login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
