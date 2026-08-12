import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";


export default function Login({
  setToken,
}) {

  const navigate = useNavigate();


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  // ===============================
  // DO NOT AUTO-REDIRECT BASED ONLY
  // ON OLD LOCAL STORAGE DATA
  // ===============================
  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const role =
      (
        localStorage.getItem("role") || ""
      )
        .toLowerCase()
        .trim();


    if (!token) {
      return;
    }


    if (role === "creator") {

      navigate(
        "/creator",
        {
          replace: true,
        }
      );

    }

    else if (
      role === "brand" ||
      role === "brand agency"
    ) {

      navigate(
        "/brand",
        {
          replace: true,
        }
      );

    }

  }, [navigate]);


  // ===============================
  // LOGIN
  // ===============================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:8000/login",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              Email: email,

              Password: password,

            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Login failed"
        );

      }


      const accessToken =
        data.access_token;


      if (!accessToken) {

        throw new Error(
          "Access token not received"
        );

      }


      // ===============================
      // GET LOGGED-IN USER
      // ===============================
      const userResponse =
        await fetch(
          "http://localhost:8000/user",
          {

            method: "GET",

            headers: {

              Authorization:
                `Bearer ${accessToken}`,

            },

          }
        );


      const userData =
        await userResponse.json();


      if (!userResponse.ok) {

        throw new Error(
          userData.detail ||
          "Unable to get user details"
        );

      }


      const user =
        userData.user;


      if (!user) {

        throw new Error(
          "User information missing"
        );

      }


      // ===============================
      // GET ROLE
      // ===============================
      const userRole =
        (
          user.role || ""
        )
          .toLowerCase()
          .trim();


      console.log(
        "LOGGED USER:",
        user
      );

      console.log(
        "LOGGED USER ROLE:",
        userRole
      );


      // ===============================
      // SAVE CORRECT DATA
      // ===============================
      localStorage.setItem(
        "token",
        accessToken
      );


      localStorage.setItem(
        "role",
        userRole
      );


      localStorage.setItem(
        "email",
        user.Email || email
      );


      // Update App state
      if (setToken) {

        setToken(
          accessToken
        );

      }


      // ===============================
      // ROLE-BASED REDIRECT
      // ===============================
      if (
        userRole === "creator"
      ) {

        navigate(
          "/creator",
          {
            replace: true,
          }
        );

      }

      else if (
        userRole === "brand" ||
        userRole === "brand agency"
      ) {

        navigate(
          "/brand",
          {
            replace: true,
          }
        );

      }

      else {

        localStorage.clear();

        if (setToken) {
          setToken(null);
        }

        throw new Error(
          `Unknown role: ${user.role}`
        );

      }

    }

    catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err.message ||
        "Login failed"
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-container">

      <div className="login-card">


        <div className="login-logo">
          ◈
        </div>


        <h1>
          CreatorIQ
        </h1>


        <p className="login-subtitle">
          Sign in to your analytics dashboard
        </p>


        {error && (

          <div className="login-error">

            {error}

          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="login-form"
        >


          <div className="login-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="login-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign In"}

          </button>


        </form>


        <p className="login-register-text">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="login-register-link"
          >
            Create Account
          </Link>

        </p>


      </div>


      <style>{`

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #020617;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 42px;
          border-radius: 20px;
          background: #111827;
          border: 1px solid #1e293b;
          box-shadow:
            0 25px 60px
            rgba(0, 0, 0, 0.45);
          color: white;
        }

        .login-logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #06b6d4
            );
          font-size: 30px;
        }

        .login-card h1 {
          margin: 0;
          text-align: center;
          font-size: 32px;
        }

        .login-subtitle {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 30px;
        }

        .login-error {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: #451a1a;
          color: #fca5a5;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-form-group label {
          color: #cbd5e1;
          font-size: 14px;
        }

        .login-form-group input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #1e293b;
          color: white;
          outline: none;
        }

        .login-form-group input:focus {
          border-color: #3b82f6;
        }

        .login-button {
          padding: 14px;
          border: none;
          border-radius: 10px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #06b6d4
            );
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-register-text {
          margin-top: 25px;
          text-align: center;
          color: #94a3b8;
        }

        .login-register-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: bold;
        }

      `}</style>

    </div>

  );

}