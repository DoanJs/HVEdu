import { useEffect, useState } from "react";
import "./ScrollButtons.css";

const ScrollButtons = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const scrollElement = document.querySelector(
      ".dashboard-scroll-area"
    ) as HTMLElement | null;

    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = scrollElement;

      setShowTop(scrollTop > 200);

      setShowBottom(
        scrollTop + clientHeight < scrollHeight - 200
      );
    };

    scrollElement.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getScrollElement = () =>
    document.querySelector(
      ".dashboard-scroll-area"
    ) as HTMLElement | null;

  const scrollToTop = () => {
    getScrollElement()?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    const scrollElement = getScrollElement();

    if (!scrollElement) return;

    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="scroll-buttons">
      {showTop && (
        <button
          type="button"
          className="btn scroll-btn scroll-btn-light"
          onClick={scrollToTop}
        >
          <i className="bi bi-chevron-up" style={{color: "yellow"}} />
        </button>
      )}

      {showBottom && (
        <button
          type="button"
          className="btn scroll-btn scroll-btn-primary"
          onClick={scrollToBottom}
        >
          <i className="bi bi-chevron-down" style={{color: "yellow"}} />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;