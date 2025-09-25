// Proxy service pour contourner les problèmes CORS avec l'API Intercom
const express = require('express');
const cors = require('cors');
// Utiliser l'API fetch native de Node.js 18+
const fetch = globalThis.fetch;

const app = express();
const PORT = 3001;

// Configuration CORS
app.use(cors());
app.use(express.json());

const INTERCOM_API_KEY = 'dG9rOjJjYTg5ZjVhXzZhYzNfNDBlY185MjE1Xzc3Yjc1NDc2NzlmZjoxOjA6ZXUtd2VzdC0x';
const INTERCOM_BASE_URL = 'https://api.intercom.io';

// Middleware pour les headers Intercom
const getIntercomHeaders = () => ({
    'Authorization': `Bearer ${INTERCOM_API_KEY}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Intercom-Version': '2.10'
});

// Fonction helper pour faire les appels API
async function proxyIntercomCall(endpoint, query, res) {
    try {
        const queryString = new URLSearchParams(query).toString();
        const url = `${INTERCOM_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
        
        console.log(`[PROXY] GET ${url}`);
        console.log(`[PROXY] Query params:`, query);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: getIntercomHeaders()
        });
        
        const data = await response.json();
        
        console.log(`[PROXY] Response status: ${response.status}`);
        console.log(`[PROXY] Response data:`, JSON.stringify(data, null, 2));
        
        if (!response.ok) {
            return res.status(response.status).json({
                error: `Intercom API Error: ${response.status}`,
                details: data
            });
        }
        
        res.json(data);
    } catch (error) {
        console.error('[PROXY] Error:', error);
        res.status(500).json({
            error: 'Proxy server error',
            details: error.message
        });
    }
}

// Routes spécifiques pour l'API Intercom
app.get('/api/intercom/me', async (req, res) => {
    await proxyIntercomCall('/me', req.query, res);
});

app.get('/api/intercom/admins', async (req, res) => {
    await proxyIntercomCall('/admins', req.query, res);
});

app.get('/api/intercom/conversations', async (req, res) => {
    await proxyIntercomCall('/conversations', req.query, res);
});

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Proxy server is running!',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Proxying requests to Intercom API`);
    console.log(`🔑 Using API key: ${INTERCOM_API_KEY.substring(0, 8)}...`);
});
