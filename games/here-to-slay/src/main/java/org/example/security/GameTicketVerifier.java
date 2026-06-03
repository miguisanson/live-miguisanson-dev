package org.example.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;

public class GameTicketVerifier {
    private static final String DEVELOPMENT_SECRET =
            "local-development-game-ticket-secret-change-before-deployment";
    private static final String EXPECTED_ISSUER = "miguisanson.dev";
    private static final String EXPECTED_AUDIENCE = "here-to-slay";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final boolean required;
    private final String secret;

    public GameTicketVerifier() {
        required = Boolean.parseBoolean(setting("HERE_TO_SLAY_AUTH_REQUIRED", "here-to-slay.auth.required", "true"));
        secret = setting("GAME_TICKET_SECRET", "here-to-slay.auth.ticket-secret", DEVELOPMENT_SECRET);

        if (required && secret.length() < 32) {
            throw new IllegalStateException("GAME_TICKET_SECRET must contain at least 32 characters.");
        }
    }

    public TicketIdentity verify(String ticket, String requestedPlayerId) {
        if ((ticket == null || ticket.isBlank()) && !required) {
            return null;
        }
        if (ticket == null || ticket.isBlank()) {
            throw new IllegalArgumentException("An account game ticket is required.");
        }

        String[] segments = ticket.split("\\.");
        if (segments.length != 3) {
            throw new IllegalArgumentException("The account game ticket is malformed.");
        }

        byte[] actualSignature = decode(segments[2]);
        byte[] expectedSignature = sign("%s.%s".formatted(segments[0], segments[1]));
        if (!MessageDigest.isEqual(expectedSignature, actualSignature)) {
            throw new IllegalArgumentException("The account game ticket signature is invalid.");
        }

        try {
            JsonNode payload = objectMapper.readTree(decode(segments[1]));
            long playerId = payload.path("pid").asLong(0);
            long expiration = payload.path("exp").asLong(0);
            String username = payload.path("username").asText("");
            String issuer = payload.path("iss").asText("");
            String subject = payload.path("sub").asText("");

            if (!EXPECTED_ISSUER.equals(issuer) || !hasAudience(payload.path("aud"))) {
                throw new IllegalArgumentException("The account game ticket target is invalid.");
            }
            if (expiration <= Instant.now().getEpochSecond()) {
                throw new IllegalArgumentException("The account game ticket has expired.");
            }
            if (playerId <= 0 || !Long.toString(playerId).equals(requestedPlayerId)) {
                throw new IllegalArgumentException("The account game ticket player does not match the connection.");
            }
            if (subject.isBlank() || username.isBlank()) {
                throw new IllegalArgumentException("The account game ticket identity is incomplete.");
            }

            return new TicketIdentity(subject, playerId, username);
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalArgumentException("The account game ticket payload is invalid.", exception);
        }
    }

    private boolean hasAudience(JsonNode audience) {
        if (audience.isTextual()) {
            return EXPECTED_AUDIENCE.equals(audience.asText());
        }
        if (audience.isArray()) {
            for (JsonNode value : audience) {
                if (EXPECTED_AUDIENCE.equals(value.asText())) {
                    return true;
                }
            }
        }
        return false;
    }

    private byte[] sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to validate account game tickets.", exception);
        }
    }

    private byte[] decode(String value) {
        try {
            return Base64.getUrlDecoder().decode(value);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("The account game ticket encoding is invalid.", exception);
        }
    }

    private static String setting(String environmentName, String propertyName, String fallback) {
        String environmentValue = System.getenv(environmentName);
        if (environmentValue != null && !environmentValue.isBlank()) {
            return environmentValue;
        }
        return System.getProperty(propertyName, fallback);
    }

    public record TicketIdentity(String accountId, long playerId, String username) {
    }
}
