
export const slideInFromSide = (direction, delay) => {
  return {
    initial: {
      x: direction === "left" ? -100 : 100,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay
      }
    }
  }
}