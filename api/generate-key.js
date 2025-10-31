// api/generate-key.js
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const SECRET = "data_api_product_mw";
  if (!SECRET) return res.status(500).json({ message: "Server misconfigured (missing JWT_SECRET)" });

  // Buat payload singkat, bisa berisi info minimal
  const payload = {
    sub: "api-client",
    iat: Math.floor(Date.now() / 1000)
  };

  // lifetime 7 hari (opsional) — sesuaikan jika mau
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });

  res.status(200).json({ apiKey: token });
}