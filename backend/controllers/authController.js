import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "vishalvmsolutiions@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "vishal@53990@";
  const adminToken = process.env.ADMIN_TOKEN || "vmsol-admin-token-xyz-123";

  if (email === adminEmail && password === adminPassword) {
    res.json({ token: adminToken, success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
