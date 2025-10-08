"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useWebSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

// If feel lag use useMemo form Piyush Garg WEBSocket
function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connection = io("localhost:3001");
    setSocket(connection);
  }, []);

  // socket?.on("connect_error", async (err) => {
  //   console.log("Socket connection error:", err);
  //   await fetch("/api/socket");
  // });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
