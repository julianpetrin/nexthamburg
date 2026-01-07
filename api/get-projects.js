// api/get-projects.js - Vercel Serverless Function

export default async function handler(req, res) {
  
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Airtable Configuration aus Environment Variables
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    
    // Prüfen ob alle Variablen gesetzt sind
    if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME || !AIRTABLE_API_KEY) {
      throw new Error('Environment variables nicht konfiguriert');
    }
    
    // Airtable API URL
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    // Airtable API aufrufen
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Daten zurückgeben
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Function Error:', error);
    
    return res.status(500).json({ 
      error: 'Fehler beim Laden der Daten',
      message: error.message 
    });
  }
}
