import React from "react";
import Slider from "react-slick";
import { FaDownload } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const resources = [
  {
    title: "React Cheatsheet",
    description: "Quick reference for React basics and hooks.",
    file: "/resources/React_Cheatsheet.pdf",
    iconColor: "text-blue-600",
  },
  {
    title: "JS Interview Questions",
    description: "Top questions for junior dev interviews.",
    file: "/resources/JS_Interview_Questions.pdf",
    iconColor: "text-yellow-500",
  },
  {
    title: "HTML & CSS Handbook",
    description: "Comprehensive PDF for frontend learners.",
    file: "/resources/HTML_CSS_Handbook.pdf",
    iconColor: "text-pink-500",
  },
  {
    title: "Node.js Basics",
    description: "Understand Node fundamentals and modules.",
    file: "/resources/Node_Basics.pdf",
    iconColor: "text-green-500",
  },
  {
    title: "MongoDB Guide",
    description: "Database concepts and MongoDB queries.",
    file: "/resources/MongoDB_Guide.pdf",
    iconColor: "text-teal-500",
  },
  {
    title: "Git Commands",
    description: "Essential Git CLI commands cheat sheet.",
    file: "/resources/Git_Commands.pdf",
    iconColor: "text-red-500",
  },
];

const FreeResources = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <FaDownload size={28} />
          Free Resources & Downloads
        </h2>
        <p>Download helpful study PDFs for free and boost your skills.</p>
        <Slider {...settings}>
          {resources.map((item, index) => (
            <div key={index} className="py-10 p-4">
              <div className="group bg-theme p-6 rounded-xl shadow-md transition-transform transform hover:-translate-y-3 hover:rotate-1 hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
                <HiOutlineDocumentText
                  className={`text-4xl mb-4 ${item.iconColor}`}
                />
                <h1 className="text-xl text-gray-800 font-semibold mb-2">
                  {item.title}
                </h1>
                <p className="mb-4">{item.description}</p>
                <a
                  href={item.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full transition transform hover:scale-105"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FreeResources;
