export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const body = await request.json();

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: body.message }] }],
          }),
        }
      );

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply received";

      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
