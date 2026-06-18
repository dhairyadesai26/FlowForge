import { useSocket } from "../../hooks/useSocket";

/**
 * ConnectionStatus — pulsing dot + label showing live WebSocket state.
 */
function ConnectionStatus() {
  const { connected } = useSocket();

  return (
    <div
      className={`connection-status ${connected ? "connected" : "disconnected"}`}
      data-testid="connection-status"
      title={connected ? "Connected to server" : "Disconnected — trying to reconnect…"}
    >
      <span className={`connection-dot ${connected ? "connected" : "disconnected"}`} />
      <span>{connected ? "Live" : "Offline"}</span>
    </div>
  );
}

export default ConnectionStatus;