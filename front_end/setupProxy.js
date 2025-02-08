const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("Setting up proxy..."); // Check if this logs
  app.use(
    '/register',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      on: { // Add event handlers for debugging
        proxyReq: (proxyReq, req) => {
          console.log("Proxying request:", req.method, req.url);
        },
        proxyRes: (proxyRes, req) => {
          console.log("Received response from target:", proxyRes.statusCode);
        },
        error: (err, req) => {
          console.error("Proxy error:", err);
        },
      },
    })
  );
  console.log("Proxy setup complete."); // Check if this logs
};