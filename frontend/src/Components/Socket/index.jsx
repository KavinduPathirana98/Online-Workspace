import io from "socket.io-client";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const ENDPOINT = "http://localhost:5000/";
const socket = io(ENDPOINT, connectionOptions);

export default socket;
