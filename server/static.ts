import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const isVercel = process.env.VERCEL === "1";
  
  let distPath: string;
  
  if (isVercel) {
    distPath = path.resolve(__dirname, "..", "public");
  } else {
    distPath = path.resolve(process.cwd(), "dist", "public");
  }
  
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(process.cwd(), "public");
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
