package org.example.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class GameTicketVerifierTest {
    private static final String SECRET = "test-only-ticket-secret-with-more-than-thirty-two-characters";
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @BeforeEach
    void configureTicketSecret() {
        System.setProperty("here-to-slay.auth.required", "true");
        System.setProperty("here-to-slay.auth.ticket-secret", SECRET);
    }

    @AfterEach
    void clearTicketSecret() {
        System.clearProperty("here-to-slay.auth.required");
        System.clearProperty("here-to-slay.auth.ticket-secret");
    }

    @Test
    void acceptsValidTicket() throws Exception {
        String token = ticket(480001L, Instant.now().plusSeconds(60).getEpochSecond());
        GameTicketVerifier.TicketIdentity identity =
                new GameTicketVerifier().verify(token, "480001");

        assertEquals("account-123", identity.accountId());
        assertEquals(480001L, identity.playerId());
        assertEquals("miguel", identity.username());
    }

    @Test
    void rejectsTamperedTicket() throws Exception {
        String token = ticket(480001L, Instant.now().plusSeconds(60).getEpochSecond());
        String tampered = token.substring(0, token.length() - 1) + (token.endsWith("a") ? "b" : "a");

        assertThrows(
                IllegalArgumentException.class,
                () -> new GameTicketVerifier().verify(tampered, "480001")
        );
    }

    @Test
    void rejectsMismatchedPlayer() throws Exception {
        String token = ticket(480001L, Instant.now().plusSeconds(60).getEpochSecond());

        assertThrows(
                IllegalArgumentException.class,
                () -> new GameTicketVerifier().verify(token, "480002")
        );
    }

    @Test
    void rejectsExpiredTicket() throws Exception {
        String token = ticket(480001L, Instant.now().minusSeconds(1).getEpochSecond());

        assertThrows(
                IllegalArgumentException.class,
                () -> new GameTicketVerifier().verify(token, "480001")
        );
    }

    private String ticket(long playerId, long expiration) throws Exception {
        String header = encode(OBJECT_MAPPER.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
        String payload = encode(OBJECT_MAPPER.writeValueAsBytes(Map.of(
                "iss", "miguisanson.dev",
                "aud", "here-to-slay",
                "sub", "account-123",
                "pid", playerId,
                "username", "miguel",
                "exp", expiration
        )));
        String unsigned = header + "." + payload;

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return unsigned + "." + encode(mac.doFinal(unsigned.getBytes(StandardCharsets.UTF_8)));
    }

    private String encode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }
}
