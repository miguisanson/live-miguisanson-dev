package org.example.handlers;

import org.example.security.GameTicketVerifier;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.SubProtocolCapable;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class SocketConnectionHandler extends TextWebSocketHandler implements SubProtocolCapable {
    private static final Duration ROOM_IDLE_TTL = Duration.ofMinutes(30);
    private static final GameTicketVerifier gameTicketVerifier = new GameTicketVerifier();
    private static final ScheduledExecutorService roomCleanup = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "here-to-slay-room-cleanup");
        thread.setDaemon(true);
        return thread;
    });

    private final Map<String, RoomSession> rooms = new ConcurrentHashMap<>();
    public static boolean VERBOSE = false;

    @Override
    public boolean supportsPartialMessages() {
        return true;
    }

    @Override
    public List<String> getSubProtocols() {
        return List.of("here-to-slay");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        session.getAttributes().put("messageRoom", new StringBuilder(session.getTextMessageSizeLimit()));

        String playerId = playerId(session);
        if (playerId == null) {
            session.close(new CloseStatus(1008, "A player identity is required."));
            return;
        }

        GameTicketVerifier.TicketIdentity identity;
        try {
            identity = gameTicketVerifier.verify(accountTicket(session), playerId);
        } catch (IllegalArgumentException exception) {
            System.out.println("Rejected websocket connection: " + exception.getMessage());
            session.close(new CloseStatus(1008, "A valid account game ticket is required."));
            return;
        }

        String roomId = identity == null ? "LOCALDEV" : identity.roomId();
        session.getAttributes().put("accountId", identity == null ? "local" : identity.accountId());
        session.getAttributes().put("accountUsername", identity == null ? "Local player" : identity.username());
        session.getAttributes().put("roomId", roomId);
        session.getAttributes().put("playerId", playerId);

        RoomSession room = rooms.computeIfAbsent(roomId, key -> new RoomSession(this, key));
        room.cancelCleanup();

        WebSocketSession wrapped = new ConcurrentWebSocketSessionDecorator(
                session,
                2000,
                session.getTextMessageSizeLimit()
        );
        WebSocketSession oldConnection = room.clients.put(playerId, wrapped);
        if (oldConnection != null && oldConnection.isOpen() && !oldConnection.getId().equals(session.getId())) {
            room.connections.removeIf(item -> item.getId().equals(oldConnection.getId()));
            oldConnection.sendMessage(new TextMessage("This account reconnected in another tab."));
            oldConnection.close(CloseStatus.GOING_AWAY);
        }

        room.connections.add(wrapped);
        wrapped.sendMessage(new TextMessage("Connected to private room " + roomId + "."));
        room.processor.sendHostAddress(wrapped);
        room.processor.sendGameStateStatus(wrapped);
        broadcast(roomId, "new connection: " + playerId);

        System.out.printf("Room %s connections: %d; active rooms: %d%n",
                roomId, room.connections.size(), rooms.size());
        if (VERBOSE) {
            System.out.println("Session ID: " + session.getId());
        }
    }

    private String playerId(WebSocketSession session) {
        if (session.getUri() == null) {
            return null;
        }
        String[] path = session.getUri().getPath().split("/");
        String[] segment = path[path.length - 1].split("=", 2);
        if (segment.length != 2 || !"user".equals(segment[0]) || !segment[1].matches("\\d+")) {
            return null;
        }
        return segment[1];
    }

    private String accountTicket(WebSocketSession session) {
        List<String> protocolHeaders = session.getHandshakeHeaders().get("Sec-WebSocket-Protocol");
        if (protocolHeaders == null) {
            return null;
        }

        for (String header : protocolHeaders) {
            for (String protocol : header.split(",")) {
                String trimmed = protocol.trim();
                if (trimmed.startsWith("account-ticket.")) {
                    return trimmed.substring("account-ticket.".length());
                }
            }
        }
        return null;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        String roomId = (String) session.getAttributes().get("roomId");
        String playerId = (String) session.getAttributes().get("playerId");
        if (roomId == null || playerId == null) {
            return;
        }
        RoomSession room = rooms.get(roomId);
        if (room == null) {
            return;
        }

        room.connections.removeIf(item -> item.getId().equals(session.getId()));
        WebSocketSession activeConnection = room.clients.get(playerId);
        boolean hasReplacement = activeConnection != null && !activeConnection.getId().equals(session.getId());
        if (!hasReplacement) {
            room.clients.remove(playerId);
            room.processor.broadcastDisconnection(playerId);
        }

        System.out.printf("Room %s connections remaining: %d%n", roomId, room.connections.size());
        if (room.connections.isEmpty()) {
            room.scheduleCleanup();
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        super.handleMessage(session, message);
        String roomId = (String) session.getAttributes().get("roomId");
        RoomSession room = rooms.get(roomId);
        if (room == null) {
            session.close(new CloseStatus(1011, "The room is no longer available."));
            return;
        }

        StringBuilder partial = (StringBuilder) session.getAttributes().get("messageRoom");
        if (!message.isLast()) {
            partial.append(message.getPayload());
            return;
        }

        String payload;
        if (!partial.isEmpty()) {
            partial.append(message.getPayload());
            payload = partial.toString();
            partial.setLength(0);
        } else {
            payload = (String) message.getPayload();
        }
        room.processor.handleMessage(session, payload);
    }

    public void broadcast(String roomId, String message) {
        TextMessage payload = new TextMessage(message);
        for (WebSocketSession session : getConnections(roomId)) {
            try {
                if (session.isOpen()) {
                    session.sendMessage(payload);
                }
            } catch (IOException exception) {
                System.out.println("Error sending room message to " + session.getId());
            }
        }
    }

    public List<WebSocketSession> getConnections(String roomId) {
        RoomSession room = rooms.get(roomId);
        if (room == null) {
            return List.of();
        }
        synchronized (room.connections) {
            return new ArrayList<>(room.connections);
        }
    }

    public WebSocketSession getClient(String roomId, String playerId) {
        RoomSession room = rooms.get(roomId);
        return room == null ? null : room.clients.get(playerId);
    }

    private final class RoomSession {
        private final String id;
        private final List<WebSocketSession> connections = Collections.synchronizedList(new ArrayList<>());
        private final Map<String, WebSocketSession> clients = new ConcurrentHashMap<>();
        private final RequestProcessor processor;
        private ScheduledFuture<?> cleanupTask;

        private RoomSession(SocketConnectionHandler server, String id) {
            this.id = id;
            this.processor = new RequestProcessor(server, id);
        }

        private synchronized void cancelCleanup() {
            if (cleanupTask != null) {
                cleanupTask.cancel(false);
                cleanupTask = null;
            }
        }

        private synchronized void scheduleCleanup() {
            cancelCleanup();
            cleanupTask = roomCleanup.schedule(() -> {
                if (connections.isEmpty() && rooms.remove(id, this)) {
                    System.out.println("Expired idle room " + id + ".");
                }
            }, ROOM_IDLE_TTL.toMinutes(), TimeUnit.MINUTES);
        }
    }
}
