module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum diatur di Vercel Environment Variables."
      });
    }

    const model = req.query.model || "gemini-2.5-flash-preview-09-2025";
    const method = req.query.method || "generateContent";

    const allowedMethods = ["generateContent", "predict"];
    if (!allowedMethods.includes(method)) {
      return res.status(400).json({ error: "Method tidak didukung." });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${method}?key=${apiKey}`;

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const contentType = upstream.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "Google Gemini API error",
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Serverless function error",
      message: error.message
    });
  }
}
