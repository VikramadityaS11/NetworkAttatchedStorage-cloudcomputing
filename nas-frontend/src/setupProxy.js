const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // any request starting with /api
    createProxyMiddleware({
      target: 'http://localhost:8000', // your backend
      changeOrigin: true,
    })
  );
};
