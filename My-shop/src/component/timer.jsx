import React, { useState, useEffect } from 'react';

function DiscountTimer() {
  const deadline = new Date('2026-07-31T23:59:59').getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(timerId);
  }, [deadline]);

  if (timeLeft.total <= 0) return <p>Discount expired!</p>;

  return (
    <>
      <style>{`
        .discount-timer {
          display: flex;
          gap: 70px;
          justify-content: center;
          margin: 20px 0;
          color: grey;
        }
        .timer-unit-container {
          text-align: center;
        }
        .timer-value {
          font-size: 60px;
          font-weight: 600;
          line-height: 1;
        }
        .timer-unit-label {
          font-size: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 5px;
        }

        /* Tablet (max-width: 991px) */
        @media (max-width: 991px) {
          .discount-timer {
            gap: 40px;
          }
          .timer-value {
            font-size: 45px;
          }
          .timer-unit-label {
            font-size: 16px;
          }
        }

        /* Large Mobile (max-width: 767px) */
        @media (max-width: 767px) {
          .discount-timer {
            gap: 25px;
          }
          .timer-value {
            font-size: 35px;
          }
          .timer-unit-label {
            font-size: 14px;
          }
        }

        /* Medium Mobile (max-width: 480px) */
        @media (max-width: 480px) {
          .discount-timer {
            gap: 15px;
          }
          .timer-value {
            font-size: 28px;
          }
          .timer-unit-label {
            font-size: 12px;
          }
        }

        /* Small Mobile (max-width: 375px) */
        @media (max-width: 375px) {
          .discount-timer {
            gap: 10px;
          }
          .timer-value {
            font-size: 24px;
          }
          .timer-unit-label {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="discount-timer">
        <div className="timer-unit-container">
          <div className="timer-value">{timeLeft.days}</div>
          <div className="timer-unit-label">Days</div>
        </div>
        <div className="timer-unit-container">
          <div className="timer-value">{timeLeft.hours}</div>
          <div className="timer-unit-label">Hours</div>
        </div>
        <div className="timer-unit-container">
          <div className="timer-value">{timeLeft.minutes}</div>
          <div className="timer-unit-label">Minutes</div>
        </div>
        <div className="timer-unit-container">
          <div className="timer-value">{timeLeft.seconds}</div>
          <div className="timer-unit-label">Seconds</div>
        </div>
      </div>
    </>
  );
}

function getTimeRemaining(endTime) {
  const total = endTime - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

export default DiscountTimer;

