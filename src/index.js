export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Manejar preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Guardar una venta (POST /sales)
    if (url.pathname === "/sales" && request.method === "POST") {
      try {
        const data = await request.json(); // { id, product, amount }
        if (!data.id || !data.product || data.amount === undefined) {
          return new Response("Missing fields in request", { status: 400 });
        }
        if (typeof data.amount !== "number" || data.amount <= 0) {
          return new Response("Invalid amount", { status: 400 });
        }

        await env.SALES.put(data.id.toString(), JSON.stringify(data));

        return new Response(JSON.stringify({ status: "success", message: "Sale saved" }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    // Listar ventas (GET /sales)
    if (url.pathname === "/sales" && request.method === "GET") {
      const list = await env.SALES.list();
      const values = await Promise.all(
        list.keys.map(async (k) => {
          const value = await env.SALES.get(k.name);
          return JSON.parse(value);
        })
      );

      return new Response(JSON.stringify({ status: "success", data: values }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("Hello World from Worker API!", {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
