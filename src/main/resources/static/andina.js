const simulation = document.querySelector("#simulation");
simulation?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const output = simulation.querySelector("output");
  const button = simulation.querySelector("button");
  button.disabled = true;
  output.textContent = "Calculando…";
  try {
    const params = new URLSearchParams(new FormData(simulation));
    const response = await fetch("/simulacion/proyectar?" + params);
    if (!response.ok) throw new Error();
    const price = await response.json();
    output.textContent =
      "Precio proyectado · " +
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "USD",
        currencyDisplay: "code",
      }).format(price);
  } catch {
    output.textContent =
      "No se pudo calcular la proyección. Inténtalo de nuevo.";
  } finally {
    button.disabled = false;
  }
});
document.querySelectorAll("form[data-confirm]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault();
  });
});

// A wireframe mountain relief illustrates the Andean landscape on the account cover.
for (const cover of document.querySelectorAll(".contours")) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  cover.prepend(canvas);
  const draw = () => {
    const w = cover.clientWidth,
      h = cover.clientHeight,
      scale = Math.min(devicePixelRatio, 2);
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    const project = (x, z) => {
      const peak =
        Math.exp(-((x - 0.62) ** 2 / 0.035 + (z - 0.48) ** 2 / 0.095)) +
        0.72 * Math.exp(-((x - 0.96) ** 2 / 0.022 + (z - 0.72) ** 2 / 0.065));
      return [
        w * (0.38 + x * 0.73 + z * 0.16),
        h *
          (0.65 +
            z * 0.53 -
            peak * 0.68 +
            0.025 * Math.sin(x * 23 + z * 8) * peak),
      ];
    };
    ctx.lineWidth = 0.85;
    for (let row = 0; row <= 32; row++) {
      const z = row / 32;
      ctx.beginPath();
      for (let col = 0; col <= 100; col++) {
        const point = project(col / 100, z);
        if (col === 0) ctx.moveTo(...point);
        else ctx.lineTo(...point);
      }
      ctx.strokeStyle = "rgba(194,202,255," + (0.24 + z * 0.45) + ")";
      ctx.stroke();
    }
  };
  new ResizeObserver(draw).observe(cover);
}
