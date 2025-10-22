import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const GoldPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const reference = query.get("reference");

    if (reference) verifyPayment(reference);
  }, [location]);

  const verifyPayment = async (reference) => {
    Swal.fire({
      title: "Processing your payment...",
      text: "Please wait while we verify your transaction.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/monthly/verify`,
        { reference },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.close();

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Verified 🎉",
          text: "You now have Gold access!",
          confirmButtonText: "Go to Dashboard",
        }).then(() => navigate("/dashboard")); // 👈 redirect after success
      } else {
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: "We couldn’t confirm your payment. Please contact support.",
        });
      }
    } catch (err) {
      Swal.close();
      console.error("Verification error:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Error verifying your payment. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Verifying your payment...
      </h1>
      <p className="text-gray-600">Please wait a moment.</p>
    </div>
  );
};

export default GoldPaymentSuccess;
