import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  loadStripe
} from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ classData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    // Create PaymentIntent on the server
    try {
      const paymentIntentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          amount: classData.price * 100, // amount in cents
          classId: classData._id,
          classTitle: classData.title,
          // optionally user info if needed
        }
      );

      const clientSecret = paymentIntentRes.data.clientSecret;

      // Confirm Card Payment with client secret
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          // billing_details: { name: "User Name" } // optionally add name/email here
        }
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message);
        setProcessing(false);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // Save payment info to DB
        await axios.post(`${import.meta.env.VITE_API_URL}/payments`, {
          paymentIntentId: paymentResult.paymentIntent.id,
          classId: classData._id,
          amount: classData.price,
          status: "Paid",
          date: new Date(),
        });

        toast.success("Payment successful! You are now enrolled.");
        navigate("/dashboard/my-enroll-classes");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Pay ${classData.price} for {classData.title}</h2>

      <div className="mb-6 border p-3 rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
          processing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {processing ? "Processing..." : `Pay $${classData.price}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/classes/${id}`)
      .then((res) => setClassData(res.data))
      .catch((err) => {
        console.error("Failed to fetch class details:", err);
        toast.error("Unable to load class details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center mt-10 text-red-500">Class not found.</div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm classData={classData} />
    </Elements>
  );
};

export default PaymentPage;
