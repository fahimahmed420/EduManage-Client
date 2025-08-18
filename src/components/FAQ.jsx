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
    <div className="section-4">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center  mb-8 flex items-center justify-center gap-3">
          <FaQuestionCircle className="w-8 h-8 " size={28}/>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg transition-all duration-300 ${openIndex === index
                  ? "border-blue-400 shadow-lg"
                  : "border-blue-100 bg-theme hover:shadow-md"
                }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-4 text-left text-lg font-medium focus:outline-none"
              >
                <h1 className="flex justify-between items-center w-full">
                  <h3 className="">{item.question}</h3>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180 text-blue-600" : ""
                      }`}
                  />
                </h1>
              </button>
              <p
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 py-2 px-6" : "max-h-0"
                  } text-gray-700`}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
