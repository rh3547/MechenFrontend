module.exports = {
  files: './dist/index.html',
  from: /type="module"/g,
  to: 'type="text/javascript"',
};
