
"use client";

export interface BadgeOptions {
  visitorName: string;
  visitorCompany?: string;
  hostName: string;
  dateLabel: string;
  photoUrl: string;
}

/**
 * Generate a simple badge image using <canvas> and trigger a PNG download.
 * The badge is intentionally minimal; you can tweak typography and layout later.
 */
export async function downloadBadgeImage(options: BadgeOptions): Promise<void> {
  const { visitorName, visitorCompany, hostName, dateLabel, photoUrl } = options;

  const width = 480;
  const height = 270;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get 2D context for canvas");
  }

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Photo placeholder frame
  const photoX = 24;
  const photoY = 32;
  const photoSize = 120;

  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 1;
  ctx.strokeRect(photoX, photoY, photoSize, photoSize);

  // Load and draw photo
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      // Clip to rounded rectangle
      const radius = 10;
      ctx.beginPath();
      ctx.moveTo(photoX + radius, photoY);
      ctx.lineTo(photoX + photoSize - radius, photoY);
      ctx.quadraticCurveTo(
        photoX + photoSize,
        photoY,
        photoX + photoSize,
        photoY + radius
      );
      ctx.lineTo(photoX + photoSize, photoY + photoSize - radius);
      ctx.quadraticCurveTo(
        photoX + photoSize,
        photoY + photoSize,
        photoX + photoSize - radius,
        photoY + photoSize
      );
      ctx.lineTo(photoX + radius, photoY + photoSize);
      ctx.quadraticCurveTo(
        photoX,
        photoY + photoSize,
        photoX,
        photoY + photoSize - radius
      );
      ctx.lineTo(photoX, photoY + radius);
      ctx.quadraticCurveTo(
        photoX,
        photoY,
        photoX + radius,
        photoY
      );
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      // If photo fails, we just keep the placeholder rectangle
      resolve();
    };
    img.src = photoUrl;
  });

  // Text layout
  const textX = photoX + photoSize + 24;
  const titleY = photoY + 10;

  ctx.fillStyle = "#111827";
  ctx.font = "bold 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("BADGE VISITATORE", textX, titleY);

  // Visitor name
  ctx.font = "bold 26px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(visitorName, textX, titleY + 40);

  // Company
  if (visitorCompany) {
    ctx.fillStyle = "#4b5563";
    ctx.font = "18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(visitorCompany, textX, titleY + 70);
  }

  // Host + date block
  ctx.fillStyle = "#111827";
  ctx.font = "16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`Ospite di: ${hostName}`, textX, titleY + 110);
  ctx.fillText(`Data: ${dateLabel}`, textX, titleY + 135);

  // Small footer text
  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Solo uso interno - Controllo accessi stabilimento", textX, height - 32);

  // Trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  const safeName = visitorName.toLowerCase().replace(/\s+/g, "-");
  a.download = `badge-${safeName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
