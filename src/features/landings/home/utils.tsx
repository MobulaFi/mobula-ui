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

      // Calcul des décalages par rapport au centre de l'élément
      const dx = (x - rect.width / 2) / (rect.width / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);

      // Rotation plus subtile
      const tiltX = dy * 10; // Ajustez pour moins d'intensité
      const tiltY = -dx * 10; // Ajustez pour moins d'intensité

      container.style.setProperty("--x", x + "px");
      container.style.setProperty("--y", y + "px");
      container.style.setProperty("--rotateX", tiltX + "deg");
      container.style.setProperty("--rotateY", tiltY + "deg");
    });
  }
};
