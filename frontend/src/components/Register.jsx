import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Response:", response.data);
      setSuccess("Registration successful! Please log in.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.error("Error response:", err.response);
        if (err.response.data.errors) {
          const errors = err.response.data.errors;
          setError(
            errors.email?.[0] ||
              errors.password?.[0] ||
              "Registration failed. Please check your input."
          );
        } else {
          setError(err.response.data.message || "Registration failed");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-700 min-h-screen text-white">
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto relative z-10 max-w-md">
          <div className="bg-blue-900 bg-opacity-80 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                Create Account
              </span>
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  className="w-full p-3 bg-blue-800 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  className="w-full p-3 bg-blue-800 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  className="w-full p-3 bg-blue-800 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  id="role"
                  className="w-full p-3 bg-blue-800 border border-blue-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="Stock Keeper">Stock Keeper</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              {error && (
                <div className="mb-6 bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 bg-green-900 bg-opacity-50 text-green-200 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition duration-300 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>
            <p className="text-center mt-6 text-blue-200">
              Already have an account?{' '}
              <a href="/login" className="text-blue-300 hover:text-blue-100">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;