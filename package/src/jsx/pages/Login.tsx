import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import nddclogo from "../../assets/images/nddclogo.webp";

interface Props {
  setAuth: (auth: { email: string; password: string }) => void;
}

interface Errors {
  email: string;
  password: string;
}

const Login: React.FC<Props> = ({ setAuth }) => {
  const [email, setEmail] = useState<string>("demo@example.com");
  const [password, setPassword] = useState<string>("123456");
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const navigate = useNavigate();

  const isLockedOut = failedAttempts >= 3;

  const onLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (isLockedOut) return;

    const newErrors: Errors = { email: "", password: "" };
    let hasError = false;

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // Simulate login and lockout condition
    if (email !== "demo@example.com" || password !== "123456") {
      setFailedAttempts((prev) => prev + 1);
      setErrors({
        email: "",
        password: "Invalid credentials. Please try again.",
      });
      return;
    }

    // Success
    setFailedAttempts(0);
    const user = { email, password };
    localStorage.setItem("AUTH", JSON.stringify(user));
    setAuth(user); // Update parent state
    navigate("/dashboard"); // Redirect to dashboard
  };

  return (
    <div className="container h-100">
      <div className="row h-100 align-items-center justify-contain-center">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body p-0">
              <div className="row m-0">
                <div className="col-xl-6 col-md-6 bg-white d-flex align-items-center justify-content-center p-4">
                  <Link to="#" className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <img
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: "contain" }}
                      src={nddclogo}
                      alt="NDDC Logo"
                    />
                  </Link>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="sign-in-your px-2">
                    <h4 className="fs-20 ">Sign in your account</h4>
                    <span>
                      Welcome back! Login with your data that you entered during
                      registration
                    </span>

                    {isLockedOut ? (
                      <div className="alert alert-danger mb-4">
                        <strong>Account Locked</strong>
                        <p className="mb-0 mt-1">
                          You have exceeded the maximum number of login attempts.
                          Please try again later or contact support.
                        </p>
                      </div>
                    ) : (
                      (errors.email || errors.password) && (
                        <div className="alert alert-danger mb-4">
                          <strong>Error:</strong> Please check your credentials and try again.
                        </div>
                      )
                    )}
                    <form onSubmit={onLogin}>
                      <div className="mb-3">
                        <label className="mb-1">
                          <strong>Email</strong>
                          <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Type Your Email Address"
                          disabled={isLockedOut}
                        />

                        {errors.email && (
                          <div className="invalid-feedback d-block">
                            {errors.email}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="mb-1">
                          <strong>Password</strong>
                          <span className="required">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            value={password}
                            placeholder="Type Your Password"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLockedOut}
                            style={{ borderRight: "none" }}
                          />
                          <span
                            className={`input-group-text bg-white cursor-pointer ${errors.password ? "border-danger" : ""}`}
                            onClick={() => !isLockedOut && setShowPassword(!showPassword)}
                            style={{ cursor: isLockedOut ? "not-allowed" : "pointer" }}
                          >
                            <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                          </span>
                        </div>
                        {errors.password && (
                          <div className="invalid-feedback d-block">
                            {errors.password}
                          </div>
                        )}
                        <div className="text-end mt-2">
                          <Link to="/page-forgot-password" className={isLockedOut ? "text-muted pe-none" : ""}>
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      <div className="row d-flex justify-content-between mt-4 mb-2">
                        <div className="mb-3 w-100">
                          <div className="form-check custom-checkbox ms-1 d-flex">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="basic_checkbox_1"
                              required
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="basic_checkbox_1"
                            >
                              Remember my preference
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={isLockedOut}
                        >
                          Sign Me In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
