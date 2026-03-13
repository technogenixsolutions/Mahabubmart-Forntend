import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";

const OrderSuccessModal = ({ orderData, close }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pieces = Array.from({ length: 80 }).map(() => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * -200,
      rotation: Math.random() * 360,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 3 + 2,
    }));
    setConfetti(pieces);

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y + c.speed,
          rotation: c.rotation + c.speed * 5,
        }))
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center overflow-hidden">
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            top: c.y,
            left: c.x,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      ))}

      <div className="bg-white w-full max-w-md rounded-lg relative p-6 text-center z-10 shadow-lg">
        <button onClick={close} className="absolute top-3 right-3">
          <IoClose className="text-2xl text-gray-500" />
        </button>

        <h2 className="text-xl font-bold mb-2">
          Thank you for your purchase! 🎉
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          We will contact you soon to confirm your order.
        </p>

        <div className="text-sm text-left space-y-1 border-t pt-3">
          <p><b>Order Number:</b> {orderData?.invoice}</p>

          <p className="mt-2"><b>Product Ordered:</b></p>
          <ul className="list-disc pl-5">
            {orderData?.cart?.map((item, i) => (
              <li key={i}>
                {item.title} × {item.quantity}
              </li>
            ))}
          </ul>

          <p className="mt-3">
            <b>Order Total:</b> ৳{orderData?.total}
          </p>
        </div>

        <div className="text-sm text-left space-y-1 border-t pt-3 mt-3">
          <p><b>Name:</b> {orderData?.user_info?.name}</p>
          <p><b>Phone:</b> {orderData?.user_info?.contact}</p>
          <p><b>Address:</b> {orderData?.user_info?.address}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderSuccessModal;
