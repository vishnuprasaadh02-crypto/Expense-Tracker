import { useState, useRef, useEffect } from "react";
import "./LoginPage.css";

// Simple client-side checks — the real validation still happens server-side.
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value.replace(/\s/g, ""));

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("email"); // "email" | "mobile"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimer]);

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const sendOtp = () => {
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setOtpSent(true);
    setOtpTimer(30);
    // TODO: wire up to POST /api/auth/otp/send/
    setTimeout(() => otpRefs.current[0]?.focus(), 0);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "email") {
      if (!isValidEmail(email)) {
        setError("Enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    } else {
      if (!otpSent) {
        sendOtp();
        return;
      }
      if (otp.some((d) => d === "")) {
        setError("Enter the 4-digit code sent to your phone.");
        return;
      }
    }

    setSubmitting(true);
    try {
      // TODO: wire up to POST /api/auth/login/ (email) or /api/auth/otp/verify/ (mobile)
      const payload =
        mode === "email"
          ? { method: "email", email, password }
          : { method: "mobile", mobile, otp: otp.join("") };

      if (onLogin) {
        await onLogin(payload);
      } else {
        await new Promise((res) => setTimeout(res, 600));
        console.log("Login payload", payload);
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-ledger" aria-hidden="true">
        <div className="ledger-mark">₹</div>
        <p className="ledger-kicker">Expense Tracker</p>
        <h1 className="ledger-headline">
          Every rupee,
          <br />
          accounted for.
        </h1>
        <ul className="ledger-lines">
          <li>
            <span>Groceries</span>
            <i />
            <span>₹450.50</span>
          </li>
          <li>
            <span>Metro pass</span>
            <i />
            <span>₹120.00</span>
          </li>
          <li>
            <span>Textbooks</span>
            <i />
            <span>₹899.00</span>
          </li>
          <li className="ledger-lines__total">
            <span>This month</span>
            <i />
            <span>₹1,469.50</span>
          </li>
        </ul>
      </aside>

      <main className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <p className="auth-eyebrow">Welcome back</p>
          <h2 className="auth-title">Log in to your account</h2>

          <div className="auth-toggle" role="tablist" aria-label="Login method">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "email"}
              className={mode === "email" ? "is-active" : ""}
              onClick={() => switchMode("email")}
            >
              Email
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "mobile"}
              className={mode === "mobile" ? "is-active" : ""}
              onClick={() => switchMode("mobile")}
            >
              Mobile number
            </button>
          </div>

          {mode === "email" ? (
            <>
              <label className="field">
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </label>

              <div className="field-row">
                <label className="checkbox">
                  <input type="checkbox" /> Stay logged in
                </label>
                <a href="#forgot" className="link">
                  Forgot password?
                </a>
              </div>
            </>
          ) : (
            <>
              <label className="field">
                <span>Mobile number</span>
                <div className="mobile-input">
                  <span className="mobile-prefix">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      setOtpSent(false);
                      setOtp(["", "", "", ""]);
                    }}
                    placeholder="98765 43210"
                    maxLength={10}
                  />
                </div>
              </label>

              {otpSent && (
                <div className="field">
                  <span>Enter the 4-digit code</span>
                  <div className="otp-row">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        className="otp-box"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="link resend"
                    disabled={otpTimer > 0}
                    onClick={sendOtp}
                  >
                    {otpTimer > 0 ? `Resend code in ${otpTimer}s` : "Resend code"}
                  </button>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting
              ? "Please wait…"
              : mode === "mobile" && !otpSent
              ? "Send code"
              : "Log in"}
          </button>

          <p className="auth-footer">
            New here? <a href="#signup">Create an account</a>
          </p>
        </form>
      </main>
    </div>
  );
}
