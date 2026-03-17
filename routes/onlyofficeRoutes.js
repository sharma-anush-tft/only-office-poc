// ======== START: ONLYOFFICE PPT BACKEND (FULL CODE) ========

const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();

const ONLYOFFICE_SECRET = "fd7d9c01aa744667af41dff66b438fb9";

// =====================
// 📁 SERVE LOCAL PPT FILE
// =====================
router.get("/file", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../assets/demo-cim.pptx");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="demo-cim.pptx"'
    );

    res.sendFile(filePath);
  } catch (error) {
    console.error("LOCAL FILE ERROR:", error);
    res.status(500).json({ error: "File not found" });
  }
});

// =====================
// 🌐 SERVE REMOTE PPT FILE (OPTIONAL)
// =====================
router.get("/file1", async (req, res) => {
  try {
    const url =
      "https://boosstblobstorage.blob.core.windows.net/cimpptx/a9740db8-7dd8-41d7-8156-26fd7964a500.pptx?sv=2025-11-05&se=2026-03-17T10%3A53%3A13Z&sr=b&sp=r&sig=oETBy496afG4%2BXoo7IwYdh5Zg5xwkGLvXQajxK6FmL0%3D";

    const response = await axios.get(url, {
      responseType: "stream",
      timeout: 15000,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="demo-cim.pptx"'
    );

    response.data.pipe(res);
  } catch (error) {
    console.error("REMOTE FILE ERROR:", error.message);
    res.status(500).json({
      error: "Failed to fetch remote file",
      details: error.message,
    });
  }
});

// =====================
// ⚙️ ONLYOFFICE CONFIG (PPT EDITOR)
// =====================
router.get("/config", (req, res) => {
  const baseUrl = "https://only-office-poc.onrender.com";
  const { username, userid } = req.query;

  const filePath = path.join(__dirname, "../assets/demo-cim.pptx");
  const stat = fs.statSync(filePath);
  const version = stat.mtimeMs;

  const key = `ppt-${version}`;

  const config = {
    document: {
      fileType: "pptx", // 🔥 IMPORTANT
      title: "demo-cim.pptx",
      url: `${baseUrl}/api/v1/onlyoffice/file`,
      key,
      permissions: {
        edit: true,
        download: true,
      },
    },

    documentType: "slide", // 🔥 IMPORTANT

    editorConfig: {
      mode: "edit",

      callbackUrl: `${baseUrl}/api/v1/onlyoffice/callback`,

      events: {
        onDocumentReady: "onOnlyOfficeReady",
      },

      user: {
        id: userid || "guest",
        name: username || "Guest User",
      },

      customization: {
        uiTheme: "default-dark",
      },
    },
  };

  const token = jwt.sign(config, ONLYOFFICE_SECRET);
  res.json({ config, token });
});

// =====================
// 💾 SAVE CALLBACK (PPT)
// =====================
router.post("/callback", async (req, res) => {
  try {
    const body = req.body;
    console.log("ONLYOFFICE CALLBACK CALLED", body);

    if ((body.status === 2 || body.status === 6) && body.url) {
      console.log("Saving PPT from ONLYOFFICE...");

      const response = await axios.get(body.url, {
        responseType: "arraybuffer",
      });

      const filePath = path.join(__dirname, "../assets/demo-cim.pptx");
      fs.writeFileSync(filePath, response.data);

      console.log("PPT saved successfully:", filePath);
    }

    res.json({ error: 0 });
  } catch (err) {
    console.error("SAVE FAILED:", err);
    res.json({ error: 1 });
  }
});

module.exports = router;

// ======== END: ONLYOFFICE PPT BACKEND (FULL CODE) ========