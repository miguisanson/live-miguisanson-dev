const url = new URL(window.location.href);
const hashParams = new URLSearchParams(url.hash.slice(1));
const gameTicket = hashParams.get("ticket") || url.searchParams.get("ticket") || "";

if (gameTicket) {
    hashParams.delete("ticket");
    url.searchParams.delete("ticket");
    url.hash = hashParams.toString();
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function parsePayload() {
    if (!gameTicket) return null;

    try {
        const encodedPayload = gameTicket.split(".")[1];
        if (!encodedPayload) return null;

        const padded = encodedPayload.replaceAll("-", "+").replaceAll("_", "/")
            .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
        const payload = JSON.parse(window.atob(padded));
        const playerId = Number(payload.pid);
        if (!Number.isSafeInteger(playerId) || playerId <= 0) return null;

        return {
            playerId,
            username: typeof payload.username === "string" ? payload.username : "",
        };
    } catch (error) {
        console.error("Unable to read the game ticket.", error);
        return null;
    }
}

const gameIdentity = parsePayload();

export function getGameIdentity() {
    return gameIdentity;
}

export function getGameTicket() {
    return gameTicket;
}
