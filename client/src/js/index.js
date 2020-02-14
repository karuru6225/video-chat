import config from '../../config.json';

function getUserMedia() {
  return (navigator.mediaDevices.getUserMedia ||
    navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia
  );
};

function getWebsocket() {
  return window.WebSocket;
}

document.addEventListener('DOMContentLoaded', (event) => {
  const WebSocket = getWebsocket();

  if (!WebSocket || !getUserMedia()) {
    alert('未対応ブラウザです');
    return;
  }

  const socket = new WebSocket(config.AwsApiGatewayInvokeUrl);

  // メッセージを待ち受ける
  socket.addEventListener('open', function (event) {
    socket.send(`connected at ${Date.now()}`);
  });

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
  });
});
