import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import nddclogo from "../../assets/images/nddclogo.webp";

interface Props {
  setAuth: (auth: { username: string; accessToken: string }) => void;
}

interface Errors {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

const Login: React.FC<Props> = ({ setAuth }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const isLockedOut = failedAttempts >= 3;

  const onLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isLockedOut) return;

    // Validation
    const newErrors: Errors = { username: "", password: "" };
    let hasError = false;

    if (!username) {
      newErrors.username = "Username is required";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setFailedAttempts((prev) => prev + 1);
        setErrors({
          username: "",
          password: errorData?.message ?? "Invalid credentials. Please try again.",
        });
        return;
      }

      const data: LoginResponse = await res.json();
      const { accessToken, refreshToken } = data.data;

      // Store tokens — never store passwords
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("AUTH", JSON.stringify({ username, accessToken }));

      setFailedAttempts(0);
      setAuth({ username, accessToken });
      navigate("/dashboard");

    } catch {
      setErrors({
        username: "",
        password: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container h-100">
      <div className="row h-100 align-items-center justify-contain-center">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body p-0">
              <div className="row m-0">
                <div className="col-xl-6 col-md-6 bg-white d-flex align-items-center justify-content-center p-4">
                  <Link
                    to="#"
                    className="w-100 h-100 d-flex align-items-center justify-content-center"
                  >
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
                    <h4 className="fs-20">Sign in your account</h4>
                    <span>
                      Welcome back! Login with your data that you entered during
                      registration
                    </span>

                    {isLockedOut ? (
                      <div className="alert alert-danger mb-4 mt-3">
                        <strong>Account Locked</strong>
                        <p className="mb-0 mt-1">
                          You have exceeded the maximum number of login attempts.
                          Please try again later or contact support.
                        </p>
                      </div>
                    ) : (
                      (errors.username || errors.password) && (
                        <div className="alert alert-danger mb-4 mt-3">
                          <strong>Error:</strong>{" "}
                          {errors.username || errors.password}
                        </div>
                      )
                    )}

                    <form onSubmit={onLogin}>
                      {/* Username */}
                      <div className="mb-3">
                        <label className="mb-1">
                          <strong>Username</strong>
                          <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.username ? "is-invalid" : ""}`}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Type Your Username"
                          disabled={isLockedOut || isLoading}
                          autoComplete="username"
                        />
                        {errors.username && (
                          <div className="invalid-feedback d-block">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      {/* Password */}
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
                            disabled={isLockedOut || isLoading}
                            autoComplete="current-password"
                            style={{ borderRight: "none" }}
                          />
                          <span
                            className={`input-group-text bg-white ${errors.password ? "border-danger" : ""}`}
                            onClick={() =>
                              !isLockedOut && !isLoading && setShowPassword(!showPassword)
                            }
                            style={{
                              cursor: isLockedOut || isLoading ? "not-allowed" : "pointer",
                            }}
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
                          <Link
                            to="/page-forgot-password"
                            className={isLockedOut ? "text-muted pe-none" : ""}
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>

                      {/* Remember me */}
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

                      {/* Submit */}
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={isLockedOut || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Signing In…
                            </>
                          ) : (
                            "Sign Me In"
                          )}
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
