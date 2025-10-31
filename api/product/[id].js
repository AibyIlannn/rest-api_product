// api/products/[id].js
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const dataPath = path.join(process.cwd(), "data-api.json");

function verifyTokenFromReq(req) {
  const header = req.headers["x-api-key"] || req.headers["authorization"];
  if (!header) return null;
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const valid = verifyTokenFromReq(req);
  if (!valid) return res.status(401).json({ message: "API key invalid atau tidak disertakan." });

  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const json = JSON.parse(raw);
    const product = json.products.find(p => p.id === Number(id));
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan." });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Gagal membaca data produk." });
  }
}