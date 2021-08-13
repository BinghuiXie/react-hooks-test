import React, { useState, useEffect } from 'react';

function useProgress(animate, time) {
  const [ progress, setProgress ] = useState(0);
  
  useEffect(
    () => {
      if (animate) {
        let animateTemp = null;
        let start = null;
        let step = timestamp => {
          if (!start) {
            start = timestamp;
          }
          let progress = timestamp - start;
          setProgress(progress);
          if (progress < time) {
            animateTemp = requestAnimationFrame(step);
          }
        };
        console.log(progress);
        animateTemp = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animateTemp)
      }
    },
    [animate, time]
  );
  return animate ? Math.min(progress / time, time) : 0;
}

export default useProgress