import { io } from "socket.io-client";
const socket = io("https://campuscrave-backend-gdrw.onrender.com", {
    transports: ["websocket"],
});
export default socket;