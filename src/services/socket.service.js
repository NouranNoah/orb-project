import { io } from "socket.io-client";
import Cookies from "js-cookie";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("https://orb-production-2793.up.railway.app", {
      auth: { token: Cookies.get("token") },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connect error:", err.message);
    });
  }
  return socket;
};
