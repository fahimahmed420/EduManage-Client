import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import Lottie from "lottie-react";
import school404 from "../assets/errorPage_Animation.json";

const Error = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center text-center px-4">
            <div className="w-72 sm:w-96 md:w-[400px]">
                <Lottie animationData={school404} loop={true} />
            </div>

            <div className="mt-6">
                <FaExclamationTriangle className="text-4xl text-blue-600 mx-auto" />
                <h1 className="text-4xl font-bold text-blue-800 mt-4">404 - Page Not Found</h1>
                <p className="text-blue-700 mt-2">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>

                <Link to="/">
                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Back to Home
                    </button>

                </Link>
            </div>
        </div>
    );
};

export default Error;
