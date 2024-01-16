// const dx = x - rect.width / 2;
// const dy = y - rect.height / 2;
// const tiltX = dy / rect.height;
// const tiltY = dx / rect.width;

export const blurEffectAnimation = (container) => {
  if (container) {
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = (x - rect.width / 2) / (rect.width / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);

      // const tiltX = dy * 5;
      // const tiltY = -dx * 5;

      container.style.setProperty("--x", x + "px");
      container.style.setProperty("--y", y + "px");
      // container.style.setProperty("--rotateX", tiltX + "deg");
      // container.style.setProperty("--rotateY", tiltY + "deg");
    });
  }
};
