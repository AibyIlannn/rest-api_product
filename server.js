import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors()); // biar bisa diakses dari website frontend
app.use(express.json());

// ambil semua data
app.get("/api/members", (req, res) => {
  const dataPath = path.join(process.cwd(), "data", "members.json");
  const members = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  res.json({ status: "success", total: members.length, members });
});

// ambil 1 data berdasarkan ID
app.get("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const dataPath = path.join(process.cwd(), "data", "members.json");
  const members = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const member = members.find((m) => m.id === parseInt(id));

  if (!member)
    return res.status(404).json({ status: "error", message: "Siswa tidak ditemukan" });

  res.json({ status: "success", member });
});

// jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));