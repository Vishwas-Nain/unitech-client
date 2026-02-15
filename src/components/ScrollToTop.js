import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setIsVisible(position > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`} 
      onClick={scrollToTop}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
};

export default ScrollToTop;
