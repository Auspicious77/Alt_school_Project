import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import validUrl from 'valid-url';
import shortid from 'shortid';
import NodeCache from 'node-cache';
import QRCode from 'qrcode';
import { OpenApiValidator } from 'express-openapi-validator';

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 });

// Custom domain for shortened URLs
const customDomain = 'https://scissor.com/';

// Define API endpoints
const router = express.Router();

// OpenAPI specification
const apiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Scissor URL Shortener API',
    version: '1.0.0',
    description: 'API for URL shortening service provided by Scissor',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/shorten': {
      post: {
        summary: 'Shorten URL',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  longUrl: { type: 'string', format: 'uri' },
                  customAlias: { type: 'string' },
                },
                required: ['longUrl'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Shortened URL generated successfully',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { shortUrl: { type: 'string' } } },
              },
            },
          },
          '400': { description: 'Invalid URL provided' },
        },
      },
    },
  },
};

// Middleware to validate requests against OpenAPI spec
app.use('/api-docs', express.static('public'));
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

// Shorten URL endpoint
router.post('/shorten', (req: Request, res: Response) => {
  const { longUrl, customAlias } = req.body;

  // Validate long URL
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  // Generate short URL
  const shortUrl = customAlias ? customDomain + customAlias : customDomain + shortid.generate();

  // Cache the shortened URL
  cache.set(shortUrl, longUrl);

  // Generate QR code
  QRCode.toDataURL(shortUrl, (err, qrCodeUrl) => {
    if (err) {
      console.error('Error generating QR code:', err);
    }

    // Return shortened URL and QR code
    res.json({ shortUrl, qrCodeUrl });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
