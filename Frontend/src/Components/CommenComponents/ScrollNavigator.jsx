// src/components/ScrollNavigator.jsx
import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollNavigator = () => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowButtons(window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    showButtons && (
      <div className="fixed bottom-5 right-3 z-30 flex flex-col gap-3 md:right-[1.2rem]">
        <button
          onClick={scrollToTop}
          className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full bg-primary-light text-white shadow-md transition md:h-[52px] md:w-[52px]"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} strokeWidth={3} />
        </button>
      </div>
    )
  );
};

export default ScrollNavigator;