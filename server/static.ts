import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const isVercel = process.env.VERCEL === "1";
  
  let possiblePaths = [
    path.join(process.cwd(), "dist", "public"),
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "client", "dist"),
  ];
  
  if (isVercel) {
    possiblePaths = [
      path.join(process.cwd(), "dist", "public"),
      path.join(process.cwd(), "public"),
    ];
  }
  
  let distPath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      break;
    }
  }
  
  if (!distPath) {
    console.log("Warning: Could not find static files. Checked:", possiblePaths);
    return;
  }

  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));

  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
