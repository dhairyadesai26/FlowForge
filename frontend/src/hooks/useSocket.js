import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export function useSocket() {
  const [connected, setConnected] = useState(socket.connected);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setError(null);
    };
    const onDisconnect = () => setConnected(false);
    const onError = (err) => setError(err?.message || "Connection error");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, []);

  return { connected, error };
}
