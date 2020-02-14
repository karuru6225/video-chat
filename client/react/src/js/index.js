import 'babel-polyfill';

console.log(process.env.NODE_ENV);

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    const array = this;
    return [].concat.apply([],
      array.map(function (elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
});

require('./app.jsx');
