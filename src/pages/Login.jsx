import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/store";
import { handleError, useHandleData } from "../js";
import { useMutation } from "react-query";
import { ResponseMessage } from "../components";
import "../css/login.css";
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleData = useHandleData();

  const handleInputChange = (e) => {
    setErrors(null);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: (userData) =>
      handleData({
        method: "POST",
        endPoint: "user/login.php",
        data: userData,
        isAuthenticated: false,
      }),
    onSuccess: (data) => {
      dispatch(loginAction({ ...data, isAuthenticated: true }));
      navigate("/home");
    },
    onError: (error) => {
      const { errorObject } = handleError(error);
      setErrors({ ...errorObject });
      if (error.status === 500 || errorObject.networkError) {
        setUser({ email: "", password: "" });
        setTimeout(() => setErrors(null), 3000);
      }
    },
  });
  const handleLogin = (e) => {
    const form = e.target;
    e.preventDefault();
    e.stopPropagation();

    form.classList.add("was-validated");

    if (!form.checkValidity()) return;

    const userData = new FormData();
    userData.append("email", user.email);
    userData.append("password", user.password);
    loginMutation.mutate(userData);
  };
  return (
    <div className="background">
      <div className="container grid">
        {errors?.serverError ||
          (errors?.networkError && (
            <ResponseMessage
              message={errors?.serverError ?? errors?.networkError}
              isSuccess={false}
            />
          ))}
        <div className="login-header">
          <h1>Login</h1>
          <p>sign in and enjoy !</p>
        </div>
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label text-secondary text-capitalize"
            >
              email
            </label>
            <input
              className={`form-control ${
                errors?.emailError ? "input__error" : ""
              }`}
              type="email"
              id="email"
              name="email"
              value={user?.email}
              onChange={handleInputChange}
              required
              pattern="^[a-zA-Z][a-zA-Z0-9%._+]+@[a-zA-Z]+\.[a-zA-Z]+$"
            />
            <div className="invalid-feedback text-capitalize">
              invalid email format
            </div>
            <div
              className="text-danger text-capitalize"
              style={{ fontSize: "0.875em" }}
            >
              {errors?.emailError}
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label text-secondary text-capitalize"
            >
              password
            </label>
            <input
              className={`form-control ${
                errors?.passwordError ? "border-red border input__error" : ""
              }`}
              type="password"
              name="password"
              onChange={handleInputChange}
              value={user?.password}
              minLength="8"
              required
            />
            <div className="invalid-feedback text-capitalize">
              invalid password. password must be 8 in length.
            </div>

            <div
              className="text-danger text-capitalize"
              style={{ fontSize: "0.875em" }}
            >
              {errors?.passwordError}
            </div>
          </div>
          <input type="submit" value="Sign in" />
        </form>
        <p className="login">
          don't have an account?<Link to="/register">register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
