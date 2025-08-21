import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// Your Botpress endpoint
const BOTPRESS_URL = "https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/21/07/20250821074212-8E8V1IJL.json";

// WhatsApp webhook
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body?.messages?.[0]?.text?.body;
    const from = req.body?.messages?.[0]?.from;

    if (message) {
      // Send user message to Botpress
      const bpResponse = await axios.post(BOTPRESS_URL, { text: message });
      const reply = bpResponse.data?.responses?.[0]?.text || "Sorry, no reply.";

      // Send reply back to WhatsApp using Cloud API
      await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Bot is running..."));
