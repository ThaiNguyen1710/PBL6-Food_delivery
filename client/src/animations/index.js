export const buttonClick = {
  whileTap: { scale: 0.95 },
};

export const fadeInOut = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

export const slideTop = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

export const slideIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

export const staggerFadeInOut = (i) => {
  return {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.3, delay: i * 0.15 },
    key: { i },
  };
};
