import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ScrollButton = styled(IconButton)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  color: #1976d2;
  border-radius: 50%;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #1976d2;
    color: white;
  }
`;

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <ScrollButton onClick={scrollToTop}>
          <ArrowUpwardIcon />
        </ScrollButton>
      )}
    </>
  );
};

export default ScrollToTopButton;
