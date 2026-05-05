export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { modelId, hfToken, payload } = req.body;

  if (!modelId || !hfToken) {
    return res.status(400).json({ error: 'modelId and hfToken are required' });
  }

  const hfUrl = `https://api-inference.huggingface.co/models/${modelId}`;

  try {
    const hfResponse = await fetch(hfUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png'
      },
      body: JSON.stringify(payload)
    });

    const contentType = hfResponse.headers.get('content-type') || '';

    if (!hfResponse.ok || contentType.includes('application/json')) {
      let errPayload = {};
      try { errPayload = await hfResponse.json(); } catch (_) {}
      return res.status(hfResponse.status).json({
        error: errPayload.error || errPayload.message || `HF error ${hfResponse.status}`,
        estimated_time: errPayload.estimated_time
      });
    }

    // Stream the image back to browser
    const imageBuffer = await hfResponse.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(Buffer.from(imageBuffer));

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Proxy error' });
  }
}
