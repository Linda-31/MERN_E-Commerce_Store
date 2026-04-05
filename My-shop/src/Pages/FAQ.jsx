import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaQuestionCircle, FaTruck, FaUndo, FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import "../Styles/style.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      category: "Orders & Shipping",
      icon: <FaTruck />,
      questions: [
        {
          question: "How do I track my order?",
          answer: "Once your order has been shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also track your order through your account dashboard under 'Order History'."
        },
        {
          question: "What are your shipping rates and delivery times?",
          answer: "We offer free standard shipping on all orders over $150. For orders below $150, a flat rate of $10 applies. Standard delivery typically takes 3-5 business days. Express shipping options are available at checkout."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location and will be calculated at checkout."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      icon: <FaUndo />,
      questions: [
        {
          question: "What is your return policy?",
          answer: "We accept returns within 30 days of purchase. Items must be in their original condition, unworn, and with all tags attached. Returns are free for all domestic orders."
        },
        {
          question: "How do I start a return or exchange?",
          answer: "To initiate a return or exchange, please visit our Returns Portal and enter your order number and email address. Follow the instructions to print your pre-paid return label."
        }
      ]
    },
    {
      category: "Payments & Security",
      icon: <FaShieldAlt />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. We also offer flexible payment options through Klarna and Afterpay."
        },
        {
          question: "Is my personal and payment information secure?",
          answer: "Absolutely. We use industry-standard SSL encryption to protect your data. Your payment information is processed securely and we never store your full credit card details on our servers."
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      {/* Header Section */}
      <div style={{ 
        padding: '120px 0 80px', 
        backgroundColor: '#fafafa', 
        textAlign: 'center',
        borderBottom: '1px solid #eee'
      }}>
        <div className="container">
          <motion.span 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              color: '#e64e4e', 
              letterSpacing: '5px', 
              textTransform: 'uppercase', 
              fontSize: '11px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '15px' 
            }}
          >
            Assistance Center
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              fontSize: '56px', 
              fontWeight: '800', 
              color: '#000', 
              margin: 0,
              fontFamily: "'Jost', sans-serif"
            }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              color: '#666', 
              fontSize: '18px', 
              maxWidth: '600px', 
              margin: '30px auto 0',
              lineHeight: '1.6'
            }}
          >
            Find quick answers to your questions about our services, products, and policies.
          </motion.p>
        </div>
      </div>

      {/* FAQ Content Section */}
      <div style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {faqData.map((section, sectionIdx) => (
                <div key={sectionIdx} style={{ marginBottom: '60px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px', 
                    marginBottom: '30px',
                    borderBottom: '1px solid #111',
                    paddingBottom: '15px'
                  }}>
                    <span style={{ color: '#e64e4e', fontSize: '20px' }}>{section.icon}</span>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: '800', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      margin: 0
                    }}>
                      {section.category}
                    </h3>
                  </div>

                  {section.questions.map((item, qIdx) => {
                    const currentIndex = `${sectionIdx}-${qIdx}`;
                    const isOpen = activeIndex === currentIndex;
                    
                    return (
                      <div 
                        key={qIdx} 
                        style={{ 
                          borderBottom: '1px solid #eee',
                          marginBottom: '10px'
                        }}
                      >
                        <button
                          onClick={() => toggleAccordion(currentIndex)}
                          style={{
                            width: '100%',
                            padding: '25px 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            color: isOpen ? '#e64e4e' : '#000',
                            transition: 'color 0.3s ease'
                          }}>
                            {item.question}
                          </span>
                          <span style={{ color: isOpen ? '#e64e4e' : '#888' }}>
                            {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
                          </span>
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ 
                                paddingBottom: '25px', 
                                color: '#666', 
                                fontSize: '16px', 
                                lineHeight: '1.8' 
                              }}>
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Support CTA Section */}
      <div style={{ 
        padding: '100px 0', 
        backgroundColor: '#050505', 
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <FaEnvelope style={{ fontSize: '40px', color: '#e64e4e', marginBottom: '30px' }} />
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px' }}>Still Have Questions?</h2>
          <p style={{ color: '#888', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Our support concierge is available 24/7 to assist you with any inquiries or concerns you may have.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: '#e64e4e', 
              color: '#fff', 
              border: 'none', 
              padding: '18px 45px', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              letterSpacing: '2.5px', 
              textTransform: 'uppercase', 
              borderRadius: '0',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/Contact'}
          >
            Contact Customer Concierge
          </motion.button>
        </div>
      </div>

      {/* Internal Styles for Accordion Hover */}
      <style>{`
        button:hover span:first-of-type {
          color: #e64e4e !important;
        }
      `}</style>
    </div>
  );
};

export default FAQ;
