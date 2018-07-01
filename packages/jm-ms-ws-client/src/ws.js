import WebSocket from 'ws'
export default function (uri, onmessage) {
  let ws = new WebSocket(uri)
  ws.on('message', function (data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    onmessage(data)
  })
  return ws
};
