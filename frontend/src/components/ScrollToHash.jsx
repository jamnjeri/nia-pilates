import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      // Offset for fixed navbar
      const offset = 80;

      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;

      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");

      // small delay ensures the DOM is ready
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;