// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/register', // Requests to /api will be proxied
//     createProxyMiddleware({
//       target: 'http://127.0.0.1:5000', // Your backend URL
//       changeOrigin: true, // Essential for localhost
//     })
//   );
// };