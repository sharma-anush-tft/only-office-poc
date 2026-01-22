const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();

const ONLYOFFICE_SECRET = "DzEH8aPJOiHienDN4OQo1ABd0dg2bQ9T";

router.get("/file", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../assets/demo-cim.docx");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="demo-cim.docx"'
    );

    res.sendFile(filePath);
  } catch (error) {
    console.error("LOCAL FILE ERROR:", error);
    res.status(500).json({ error: "File not found" });
  }
});

router.get("/config", (req, res) => {
  const baseUrl = `https://only-office-poc-production.up.railway.app`;

  const config = {
    document: {
      fileType: "docx",
      title: "demo-cim.docx",

      url: `${baseUrl}/api/v1/onlyoffice/file`,
      // url: `https://storage.googleapis.com/public_images_legacy/3f7dda45-21d0-43df-b756-3b1b358f6db0.docx`,
      key: "doc-" + Date.now(),
      // key: 'doc-c0c80518-df6c-4775-9b84-aacc60a383ae-8b5d7140-0790-4e27-9512-f8cb0edde06a'
    },

    documentType: "word",

    editorConfig: {
      mode: "edit",
      // callbackUrl: `${baseUrl}/api/v1/onlyoffice/callback`,
      callbackUrl: `https://boosst-apim.azure-api.net/test/api/onlyoffice/callback/c0c80518-df6c-4775-9b84-aacc60a383ae?subscription-key=0ffea418a5d24b1d956419d812eda5e4`,
      user: {
        id: "1000",
        name: "Anush Sharma",
      },
      customization: {
        uiTheme: "default-dark",
        plugins: false,
      },
    },
  };

  const token = jwt.sign(config, ONLYOFFICE_SECRET);

  res.json({ config, token });
});

router.post("/callback", async (req, res) => {
  try {
    const body = req.body;
    console.log("ONLYOFFICE CALLBACK CALLED", body);
    if (body.status === 2 && body.url) {
      console.log("Saving document from onluyoffice:");

      const response = await axios.get(body.url, {
        responseType: "arraybuffer",
      });

      const filePath = path.join(__dirname, "../assets/demo-cim.docx");
      fs.writeFileSync(filePath, response.data);
      console.log("Document saved successfully:", filePath);
    }

    res.json({ error: 0 });
  } catch (err) {
    console.error("SAVE FAILED:", err);

    res.json({ error: 1 });
  }
});

module.exports = router;
