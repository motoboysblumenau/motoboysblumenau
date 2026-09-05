/**
 * Mercado Livre notification receiver.
 *
 * Deployed as Cloudflare Worker `meli-notifications`.
 * Route: meli.motoboysblumenau.com.br/meli/notifications*
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/meli/notifications") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method === "GET") {
      return Response.json({ status: "ok", service: "meli-notifications" });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, POST" },
      });
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 32768) {
      return new Response("Payload too large", { status: 413 });
    }

    console.log(JSON.stringify({
      event: "meli_notification_received",
      contentLength,
      contentType: request.headers.get("content-type") || null,
      rayId: request.headers.get("cf-ray") || null,
    }));

    return new Response(null, { status: 204 });
  },
};
