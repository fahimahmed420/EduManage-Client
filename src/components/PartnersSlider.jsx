import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { FaHandshake } from "react-icons/fa"; 
import EmpCloudAnimation from "../assets/slider_animations/empCloud.json";
import ReactAnimation from "../assets/slider_animations/react.json";
import JsAnimation from "../assets/slider_animations/java.json";
import ChatGPTAnimation from "../assets/slider_animations/chatgtp.json";
import MongoDBAnimation from "../assets/slider_animations/mongo.json";
import StripeAnimation from "../assets/slider_animations/stripe.json";
import GithubAnimation from "../assets/slider_animations/Github.json";
import NetlifyAnimation from "../assets/slider_animations/netlify.json";

const partners = [
  {
    name: "EmpCloud",
    description: "MERN stack specialists who helped architect the EduManage platform.",
    animation: EmpCloudAnimation,
  },
  {
    name: "React",
    description: "The core library powering our interactive frontend experience.",
    animation: ReactAnimation,
  },
  {
    name: "JavaScript",
    description: "The backbone of our web application development.",
    animation: JsAnimation,
  },
  {
    name: "ChatGPT",
    description: "Integrated AI assistance for enhanced user interaction.",
    animation: ChatGPTAnimation,
  },
  {
    name: "MongoDB Atlas",
    description: "Cloud-hosted NoSQL database powering our backend data layer.",
    animation: MongoDBAnimation,
  },
  {
    name: "Stripe",
    description: "Secure and seamless payment processing for users worldwide.",
    animation: StripeAnimation,
  },
  {
    name: "GitHub",
    description: "Collaborative version control for our source code management.",
    animation: GithubAnimation,
  },
  {
    name: "Netlify",
    description: "Blazing fast deployment & hosting for modern web apps.",
    animation: NetlifyAnimation,
  },
];

const PartnersSlider = () => {
  return (
    <div className="w-full section-reverse py-12 overflow-hidden pb-16">
      <h2 className="text-3xl font-bold text-center flex justify-center items-center gap-2 mb-12">
        <FaHandshake className="text-4xl " /> 
        Our Partners & Collaborators
      </h2>

      {/* Infinite slider */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex space-x-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 40, // slowed down for more partners
            ease: "linear",
          }}
        >
          {/* Duplicate list for seamless looping */}
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="relative min-w-[200px] h-36 bg-theme rounded-4xl shadow-md overflow-hidden group cursor-pointer my-2 hover:scale-105 transition-transform duration-300"
            >
              {/* Lottie Animation */}
              <div className="flex justify-center items-center h-full p-4">
                <Lottie
                  animationData={partner.animation}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Details on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">{partner.name}</h3>
                <p className="text-sm">{partner.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersSlider;
