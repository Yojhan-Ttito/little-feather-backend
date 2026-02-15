export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/sales") {
      return new Response(JSON.stringify({
        status: "success",
        data: [
          { id: 1, product: "Producto A", amount: 120 },
          { id: 2, product: "Producto B", amount: 80 }
        ]
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Hello World from Worker API!", {
      headers: { "Content-Type": "text/plain" },
    });
  }
};