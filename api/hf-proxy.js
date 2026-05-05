const { InferenceClient } = require("@huggingface/inference");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { modelId, hfToken, payload, provider = 'replicate' } = req.body;

  if (!modelId || !hfToken) {
    return res.status(400).json({ error: 'modelId and hfToken are required' });
  }

  try {
    const client = new InferenceClient(hfToken);

    const imageBuffer = Buffer.from(payload.inputs.image, 'base64');

    const imageBlob = await client.imageToImage({
      provider,
      model: modelId,
      inputs: imageBuffer,
      parameters: {
        prompt: payload.inputs.prompt,
        ...payload.parameters
      }
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(Buffer.from(arrayBuffer));

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Proxy error' });
  }
};
