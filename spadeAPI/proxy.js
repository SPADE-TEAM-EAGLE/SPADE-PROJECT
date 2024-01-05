const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = require("./index");
app.use(
  "/",
  createProxyMiddleware({
    target: process.env.PROXY_TARGET || 'https://www.app.spaderent.com',
    changeOrigin: true,
  })
);
const port = 3000;
app.listen(port, () => {
  console.log(`Reverse proxy server is running on port ${port}`);
});