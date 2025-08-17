import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ classData, userFromDB }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!classData?.price) return;

    axios
      .post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        amount: classData?.price,
      })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => {
        console.error("Error creating payment intent:", err);
        toast.error("Failed to initiate payment.");
      });
  }, [classData?.price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: userFromDB.name,
          email: userFromDB.email,
        },
      },
    });

    if (result.error) {
      console.error("Payment failed:", result.error);
      toast.error(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      try {
        // Save payment info to DB
        await axios.post(`${import.meta.env.VITE_API_URL}/payments`, {
          email: userFromDB.email,
          transactionId: result.paymentIntent.id,
          amount: classData.price,
          classId: classData._id,
          studentId: userFromDB._id,
          status: "paid",
          paidAt: new Date(),
        });

        // Save enrollment info to DB
        await axios.post(`${import.meta.env.VITE_API_URL}/enrollments`, {
          studentId: userFromDB._id,
          classId: classData._id,
          status: "paid",
          transactionId: result.paymentIntent.id,
          enrolledAt: new Date(),
        });

        toast.success("Payment successful & enrollment saved!");
        setTimeout(() => {
          navigate("/dashboard/my-enroll-classes");
        }, 3000);
      } catch (err) {
        console.error("Error saving payment/enrollment:", err);
        toast.warning("Payment succeeded, but saving failed.");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={userFromDB.name}
          disabled
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={userFromDB.email}
          disabled
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Card Information</label>
        <div className="border border-gray-300 rounded-lg px-4 py-2">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: { color: "#e53e3e" },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mt-4 font-semibold"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [userFromDB, setUserFromDB] = useState(null);

  const {
    data: classData,
    isLoading: classLoading,
    isError: classError,
  } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/classes/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user.email}`)
      .then((res) => setUserFromDB(res.data))
      .catch((err) => {
        console.error("Failed to fetch user from DB:", err);
        toast.error("Failed to fetch user data.");
      });
  }, [user?.email]);

  if (classLoading || !userFromDB) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (classError || !classData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Class not found.
      </div>
    );
  }

  if (!classData.price) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl mb-6">This course is free!</h2>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => {
            toast.success("Enroll logic for free courses goes here.");
          }}
        >
          Enroll for Free
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden">
          {/* Left Side - Course Info */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex flex-col justify-center items-center text-white w-full md:w-80">
            <h2 className="text-lg font-medium">Total Amount:</h2>
            <p className="text-4xl font-bold mt-2">${classData.price}</p>
            <p className="mt-4 text-lg font-medium text-center">
              Course: <span>{classData.title}</span>
            </p>
          </div>

          {/* Right Side - Payment Form */}
          <div className="bg-white p-8 w-full md:w-96">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Payment Page
            </h2>
            <CheckoutForm classData={classData} userFromDB={userFromDB} />
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;