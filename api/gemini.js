module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY belum terbaca di Vercel." });
  }

  try {
    const model = req.query.model || "gemini-2.5-flash";
    const method = req.query.method || "generateContent";

    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:${method}?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Function error",
      message: error.message
    });
  }
};
