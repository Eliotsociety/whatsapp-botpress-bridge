const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');

// Replace with your Botpress webhook URL
const BOTPRESS_URL = "https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/21/07/20250821074212-8E8V1IJL.json";

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code with your WhatsApp phone app');
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

client.on('message', async msg => {
    try {
        const response = await fetch(BOTPRESS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'message', text: msg.body })
        });
        const data = await response.json();

        if (data.responses && data.responses.length > 0) {
            msg.reply(data.responses[0].text);
        }
    } catch (err) {
        console.error("❌ Error:", err);
    }
});

client.initialize();
