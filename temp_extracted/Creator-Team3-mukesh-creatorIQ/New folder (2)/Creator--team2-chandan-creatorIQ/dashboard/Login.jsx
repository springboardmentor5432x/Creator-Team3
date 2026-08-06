import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(
      localStorage.getItem("creatorUser")
    );

    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", savedUser.role);

      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FF] flex items-center justify-center p-5">

      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-[28px] border border-[#DDE3F0] shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT BRAND PANEL */}

        <div className="hidden md:flex flex-col justify-between p-10 bg-[#172033] text-white">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#5B4BDB] flex items-center justify-center">

                <BarChart3 size={23} />

              </div>

              <div>

                <h1 className="text-xl font-bold">
                  Pulse Studio
                </h1>

                <p className="text-sm text-slate-400">
                  Creator Intelligence
                </p>

              </div>

            </div>

            <div className="mt-20">

              <p className="text-[#AFA8FF] text-sm font-semibold uppercase tracking-widest">
                Analytics Platform
              </p>

              <h2 className="text-4xl font-bold leading-tight mt-4">

                Understand your audience.

                <br />

                Grow your impact.

              </h2>

              <p className="text-slate-400 mt-5 leading-7">

                Track content performance, understand audience behavior,
                and make better decisions using intelligent analytics.

              </p>

            </div>

          </div>

          <div className="border-t border-white/10 pt-5">

            <p className="text-sm text-slate-400">

              © 2026 Pulse Studio

            </p>

          </div>

        </div>


        {/* RIGHT LOGIN PANEL */}

        <div className="flex items-center justify-center p-7 md:p-12">

          <div className="w-full max-w-md">

            <div className="mb-8">

              <p className="text-sm font-semibold text-[#5B4BDB]">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold text-[#1E293B] mt-2">

                Sign in to your account

              </h2>

              <p className="text-sm text-slate-500 mt-2">

                Enter your details to access your analytics dashboard.

              </p>

            </div>


            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="text-sm font-semibold text-slate-700">

                  Email Address

                </label>

                <div className="relative mt-2">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input

                    type="email"

                    value={email}

                    onChange={(e) =>
                      setEmail(e.target.value)
                    }

                    placeholder="Enter your email"

                    required

                    className="
                    w-full
                    border
                    border-[#DDE3F0]
                    rounded-xl
                    py-3.5
                    pl-11
                    pr-4
                    outline-none
                    focus:border-[#5B4BDB]
                    focus:ring-4
                    focus:ring-[#5B4BDB]/10
                    "

                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <div className="flex justify-between">

                  <label className="text-sm font-semibold text-slate-700">

                    Password

                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="text-sm text-[#5B4BDB]"
                  >

                    Forgot password?

                  </button>

                </div>


                <div className="relative mt-2">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={password}

                    onChange={(e) =>
                      setPassword(e.target.value)
                    }

                    placeholder="Enter your password"

                    required

                    className="
                    w-full
                    border
                    border-[#DDE3F0]
                    rounded-xl
                    py-3.5
                    pl-11
                    pr-12
                    outline-none
                    focus:border-[#5B4BDB]
                    focus:ring-4
                    focus:ring-[#5B4BDB]/10
                    "

                  />

                  <button

                    type="button"

                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }

                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    "

                  >

                    {showPassword
                      ? <EyeOff size={18} />
                      : <Eye size={18} />
                    }

                  </button>

                </div>

              </div>


              {/* LOGIN BUTTON */}

              <button

                type="submit"

                className="
                w-full
                py-3.5
                rounded-xl
                bg-[#5B4BDB]
                hover:bg-[#4939C7]
                text-white
                font-semibold
                flex
                justify-center
                items-center
                gap-2
                transition
                "

              >

                Sign In

                <ArrowRight size={18} />

              </button>

            </form>


            <p className="text-center text-sm text-slate-500 mt-7">

              New to Pulse Studio?

              <button

                onClick={() =>
                  navigate("/register")
                }

                className="ml-1 text-[#5B4BDB] font-semibold"

              >

                Create an account

              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
