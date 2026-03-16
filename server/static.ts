import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  let distPath = path.resolve(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(__dirname, "..", "public");
  }
  
  if (!fs.existsSync(distPath)) {
    console.log("Warning: Could not find static files at", distPath);
    return;
  }

  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));

  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
