import Link from "next/link";
import { useEffect, useState } from "react";

const PromotionModal = ({ promotion }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!promotion) return;
    const hasSeen = localStorage.getItem("hasSeenPromotionModal");
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [promotion]);

  const handleClose = () => {
    localStorage.setItem("hasSeenPromotionModal", "true");
    setIsVisible(false);
  };

  if (!isVisible || !promotion) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.65)",
        padding: "16px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "min(90vw, 520px)",   /* mobile তে 90%, desktop এ max 520px */
          maxHeight: "90vh",              /* screen height এর 90% এর বেশি না */
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            backdropFilter: "blur(4px)",
          }}
        >
          ✕
        </button>

        {/* Image */}
        {promotion.link ? (
          <Link
            href={promotion.link || "#"}
            onClick={handleClose}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", cursor: "pointer" }}
          >
            <img
              src={promotion.image}
              alt="Promotion"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "85vh",        /* image কখনো screen এর 85% এর বেশি না */
                objectFit: "contain",     /* image crop হবে না, পুরোটা দেখাবে */
                display: "block",
              }}
            />
          </Link>
        ) : (
          <img
            src={promotion.image}
            alt="Promotion"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "85vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PromotionModal;