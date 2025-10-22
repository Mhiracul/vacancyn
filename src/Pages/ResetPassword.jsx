import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../config";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    if (!password.trim()) {
      Swal.fire("Error", "Please enter a new password.", "error");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/auth/reset-password/${token}`, {
        password,
      });
      Swal.fire("Success", "Password reset successful!", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid or expired token",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-outfit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Your Password
        </h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md w-full p-3 mb-4"
        />
        <button
          onClick={handleReset}
          className="bg-[#0867bc] text-white w-full py-2 rounded-md"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
