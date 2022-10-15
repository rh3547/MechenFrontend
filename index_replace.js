module.exports = {
  files: './dist/index.html',
  from: [/type="module"/g, /.js/g],
  to: ['type="text/javascript"', '.js?version=1.6.0'],
};
