import * as React from "react";
import "../css/faq.css";

function AskedQuestions() {
  const faqData = [
    {
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces.",
    },
    {
      question: "How do I install React?",
      answer: "You can install React by running 'npm install react' in your project directory.",
    },
    {
      question: "What is JSX?",
      answer: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
    },
    {
      question: "What is the virtual DOM in React?",
      answer: "The virtual DOM is a lightweight copy of the actual DOM. React uses it to efficiently update and render components without directly manipulating the real DOM."
    },
    {
      question: "What are React hooks?",
      answer: "React hooks are functions that allow you to use state and other React features in functional components. They were introduced in React 16.8."
    }
    // Add more questions and answers here
  ];

  return (
    <>
      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question} 
            {/* <span className="test">{">"}</span> */}
            </h3> 
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default AskedQuestions;
