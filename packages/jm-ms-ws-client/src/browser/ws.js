export default function (uri, onmessage) {
  let ws = new WebSocket(uri)
  ws.onmessage = function (event) {
    onmessage(event.data)
  }
  return ws
};
