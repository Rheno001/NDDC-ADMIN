import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/nddc-login.jpeg";
import "./Login.css";

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
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Left Panel - Branding */}
        <div
          className="login-brand-panel"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="brand-logo-section">
            <h1 className="brand-tagline">NDDC Admin Portal</h1>
            <p className="brand-subtitle">
              Secure administration gateway for managing the Niger Delta
              Development Commission's core operations and resources.
            </p>
          </div>
          <div className="brand-illustration">
            {/* You can add an illustration image here if available */}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h4>Sign in to your account</h4>
            <p>Enter your administrator credentials to access the portal</p>
          </div>

          {isLockedOut ? (
            <div className="login-error-banner">
              <div className="error-icon">
                <i className="fa fa-lock"></i>
              </div>
              <div className="error-text">
                Your account is locked due to multiple failed attempts. Please
                try again later or contact support.
              </div>
            </div>
          ) : (
            (errors.username || errors.password) && (
              <div className="login-error-banner">
                <div className="error-icon">
                  <i className="fa fa-exclamation-triangle"></i>
                </div>
                <div className="error-text">
                  {errors.username || errors.password}
                </div>
              </div>
            )
          )}

          <form onSubmit={onLogin}>
            {/* Username Field */}
            <div className="login-form-group">
              <label>
                Username <span className="required-star">*</span>
              </label>
              <div
                className={`login-input-wrapper ${errors.username ? "has-error" : ""}`}
              >
                <i className="fa fa-user input-icon"></i>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLockedOut || isLoading}
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <div className="field-error">
                  <i className="fa fa-info-circle"></i> {errors.username}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="login-form-group">
              <label>
                Password <span className="required-star">*</span>
              </label>
              <div
                className={`login-input-wrapper ${errors.password ? "has-error" : ""}`}
              >
                <i className="fa fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLockedOut || isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() =>
                    !isLockedOut && !isLoading && setShowPassword(!showPassword)
                  }
                  tabIndex={-1}
                >
                  <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                </button>
              </div>
              {errors.password && (
                <div className="field-error">
                  <i className="fa fa-info-circle"></i> {errors.password}
                </div>
              )}
            </div>

            <div className="login-options-row">
              <label className="remember-me-check">
                <input type="checkbox" id="basic_checkbox_1" />
                <span>Remember my preference</span>
              </label>
              <Link
                to="/page-forgot-password"
                className={`forgot-password-link ${isLockedOut ? "text-muted pe-none" : ""}`}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLockedOut || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
