import React from "react";
import { EyeOff, Loader, Lock, Mail, MessageSquare, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signUp, isSignInUp } = useAuthStore();

  const validateForm = () => {

    const { fullName, email, password } = formData;

    // if (!fullName || !email || !password) return toast.error("All fields are required");
    if (!fullName ) return toast.error("Flull Name is required");
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters long");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Email is invalid");
    // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)) return toast.error("Password must contain at least one uppercase letter, one lowercase letter, and one number");

    return true;

  };
  const handleSubmit = (e:any) => {
    e.preventDefault();
    if(validateForm()) signUp(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* //leftSide */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center group:hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 " />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSignInUp}
            >
              {isSignInUp ? (
                <>
                  <Loader className="siz-5 animate-spin" /> Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-4 w-full">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign In
            </Link>
          </p>
          </div>
        </div>
      </div>

      {/* //rightSide */}
      <AuthImagePattern 
      title="Join Our Community"
      subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
      
    </div>
  );
};

export default SignUpPage;
