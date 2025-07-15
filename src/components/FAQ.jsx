import { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

const faqs = [
  {
    question: "What is EduManage?",
    answer:
      "EduManage is a modern platform that connects students, tutors, and educational institutions to manage classes, assignments, and learning progress efficiently.",
  },
  {
    question: "How can I enroll in a class?",
    answer:
      "To enroll in a class, go to the All Classes page, choose an approved course, and click Enroll. You’ll be redirected to the payment and class details page.",
  },
  {
    question: "How do I apply to teach?",
    answer:
      "Click on 'Teach on EduManage' in the navbar, fill out the form, and submit your application. Admins will review and approve qualified requests.",
  },
  {
    question: "Is there a mobile-friendly version?",
    answer:
      "Yes, EduManage is fully responsive and optimized for mobile, tablet, and desktop devices.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "We support various payment methods through secure gateways. You’ll be guided through the process on the class details page after clicking Enroll.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8 flex items-center justify-center gap-3">
        <FaQuestionCircle className="w-8 h-8 text-blue-600" />
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`border rounded-lg transition-all duration-300 ${
              openIndex === index
                ? "border-blue-400 shadow-lg bg-blue-50"
                : "border-blue-100 bg-white hover:shadow-md"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full px-6 py-4 text-left text-lg font-medium text-blue-800 focus:outline-none"
            >
              <div className="flex justify-between items-center w-full">
                <span>{item.question}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 py-2 px-6" : "max-h-0"
              } text-gray-700`}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default FAQ;
