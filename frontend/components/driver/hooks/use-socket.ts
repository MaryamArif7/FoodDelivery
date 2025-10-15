"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (onEvent?: (event: string, data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // connect to your backend socket server
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket Server");
    });

    // Listen to all incoming events
    if (onEvent) {
      socket.onAny((event, data) => onEvent(event, data));
    }

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [onEvent]);

  return socketRef.current;
};
