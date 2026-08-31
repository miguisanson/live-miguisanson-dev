import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGameLaunchAccess } from "@/lib/admin-data";
import { getGameInstanceId } from "@/lib/game-tickets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const assetRoot = "/game-assets/dd-project/html5game/";

function runtimeHtml(instanceId: string) {
  const serializedInstance = JSON.stringify(instanceId);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="color-scheme" content="dark">
  <title>DD Project</title>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #050505; }
    body { display: grid; place-items: center; }

    /* The GameMaker runtime absolutely-positions its own canvas
       (position:absolute; inset:50% -50% -50% 50%; transform:translate(-50%,-50%)).
       Without position:relative here that resolves against the viewport, so the
       canvas stretched to the full window at the wrong aspect ratio — distorting
       the picture and rendering many times more pixels than the game needs. */
    #gm4html5_div_id {
      position: relative;
      width: min(100vw, calc(100vh * 10 / 9));
      height: min(100vh, calc(100vw * 9 / 10));
    }

    /* Size is left to the runtime; only presentation is set here. Overriding
       width/height fought the runtime's own scaling. */
    canvas {
      display: block;
      margin: 0;
      image-rendering: pixelated;
      touch-action: none;
      outline: none;
    }

    /* Start gate. Browsers refuse to start audio without a user gesture, and an
       iframe receives no keyboard events until something inside it holds focus.
       One click satisfies both, so the game never sits on the title screen
       looking frozen because its input was never wired up. */
    #start-gate {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      gap: 10px;
      align-content: center;
      background: rgba(5, 5, 5, 0.82);
      backdrop-filter: blur(2px);
      color: #e9eef3;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      cursor: pointer;
      z-index: 5;
      border: 0;
      width: 100%;
      text-align: center;
    }
    #start-gate[hidden] { display: none; }
    #start-gate .play {
      width: 62px; height: 62px; border-radius: 50%;
      display: grid; place-items: center;
      background: #34d07e; color: #06120b;
      font-size: 24px; line-height: 1;
    }
    #start-gate .label { font-size: 15px; font-weight: 600; letter-spacing: .01em; }
    #start-gate .hint { font-size: 12px; opacity: .7; max-width: 34ch; line-height: 1.45; }

    /* Shown when the frame loses focus mid-game — keyboard is dead until it
       comes back, so say so rather than letting it feel broken. */
    #focus-hint {
      position: absolute;
      left: 50%; bottom: 12px; transform: translateX(-50%);
      padding: 6px 12px; border-radius: 999px;
      background: rgba(5, 5, 5, .82); color: #e9eef3;
      font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px;
      pointer-events: none; z-index: 4;
    }
    #focus-hint[hidden] { display: none; }
  </style>
</head>
<body>
  <div class="gm4html5_div_class" id="gm4html5_div_id">
    <button type="button" id="start-gate">
      <span class="play" aria-hidden="true">&#9654;</span>
      <span class="label">Click to play</span>
      <span class="hint">One click enables sound and hands keyboard control to the game.</span>
    </button>
    <div id="focus-hint" hidden>Click the game to give it keyboard control</div>
    <canvas id="canvas" width="480" height="432" tabindex="0" aria-label="DD Project game canvas">
      Your browser does not support HTML5 canvas.
    </canvas>
  </div>
  <!-- Installed BEFORE the game script so the runtime never opens these. -->
  <script>
    (function () {
      // WHY THIS EXISTS
      //
      // GameMaker implements file_exists() as a *synchronous* XHR:
      //     xhr.open('HEAD', path, false)
      // The title screen calls it for savedata0/1/2.sav every frame, so the game
      // fired ~180 blocking requests a second. Each blocked the main thread for a
      // full round trip, freezing the page, and each 404 was rendered by the
      // Next.js router, saturating the server.
      //
      // Game data files are backed by localStorage instead: no network, no main
      // thread blocking, and saving actually persists — writing to a static asset
      // path never could.
      //
      // The prototype methods are patched IN PLACE rather than replacing the
      // XMLHttpRequest class. A wrapper object would have to forward every
      // handler property (onload, onreadystatechange, onprogress, …) to the real
      // request, and anything missed silently breaks asset loading. Patching in
      // place means a request we do not intercept is an ordinary, untouched XHR.
      var PREFIX = ${JSON.stringify(assetRoot)};
      var instance = ${serializedInstance};

      // Files the game treats as writable data, not shipped assets. Deliberately
      // narrow: anything not matched here goes to the network as normal.
      function isGameDataFile(url) {
        if (typeof url !== "string") return false;
        var path = url.split("?")[0];
        if (path.indexOf(PREFIX) === -1) return false;
        if (path.indexOf("/localization/") !== -1) return false;
        return /\.(sav|ini|dat)$/i.test(path) || /settings_config\.json$/i.test(path);
      }

      function storageKey(url) {
        var path = url.split("?")[0];
        return "ddproject:" + instance + ":" + path.slice(path.lastIndexOf("/") + 1);
      }

      function define(xhr, name, value) {
        Object.defineProperty(xhr, name, { value: value, configurable: true, writable: true });
      }

      var proto = XMLHttpRequest.prototype;
      var realOpen = proto.open;
      var realSend = proto.send;
      var realSetHeader = proto.setRequestHeader;
      var realOverrideMime = proto.overrideMimeType;

      proto.open = function (method, url) {
        this.__ddIntercept = isGameDataFile(url);
        if (!this.__ddIntercept) {
          return realOpen.apply(this, arguments);
        }
        this.__ddMethod = String(method || "GET").toUpperCase();
        this.__ddKey = storageKey(url);
      };

      // These throw InvalidStateError on a request that was never really opened.
      proto.setRequestHeader = function () {
        if (this.__ddIntercept) return;
        return realSetHeader.apply(this, arguments);
      };
      proto.overrideMimeType = function () {
        if (this.__ddIntercept) return;
        return realOverrideMime.apply(this, arguments);
      };

      proto.send = function (body) {
        if (!this.__ddIntercept) {
          return realSend.apply(this, arguments);
        }

        var stored = null;
        try {
          stored = window.localStorage.getItem(this.__ddKey);
        } catch (e) {
          stored = null; // Private browsing: behave as "no save present".
        }

        var status;
        var text = "";
        if (this.__ddMethod === "PUT" || this.__ddMethod === "POST") {
          try {
            window.localStorage.setItem(this.__ddKey, body == null ? "" : String(body));
            status = 200;
          } catch (e) {
            status = 507;
          }
        } else if (stored === null) {
          status = 404;
        } else {
          status = 200;
          text = this.__ddMethod === "HEAD" ? "" : stored;
        }

        // Own properties shadow the prototype's read-only getters.
        define(this, "status", status);
        define(this, "statusText", status === 200 ? "OK" : "Not Found");
        define(this, "readyState", 4);
        define(this, "responseText", text);
        define(this, "response", text);
        define(this, "getAllResponseHeaders", function () { return ""; });
        define(this, "getResponseHeader", function () { return null; });

        if (typeof this.onreadystatechange === "function") this.onreadystatechange();
        if (typeof this.onload === "function") this.onload();
      };
    })();
  </script>

  <script src="${assetRoot}DD-Project.js"></script>
  <script>
    window.__MIGUISANSON_GAME_INSTANCE__ = ${serializedInstance};
    g_GameMakerHTML5Dir = ${JSON.stringify(assetRoot)};

    window.addEventListener("load", function () {
      var canvas = document.getElementById("canvas");
      var gate = document.getElementById("start-gate");
      var focusHint = document.getElementById("focus-hint");
      var started = false;

      // GameMaker binds keyboard with window.onkeydown / window.onkeyup on THIS
      // document's window, and clears both on blur. Inside an iframe that means
      // keys are dead until something here holds focus — which is why the game
      // could render its menu and then ignore every key press.
      function takeFocus() {
        try {
          window.focus();
        } catch (e) {
          /* focus() can throw in odd embedding contexts; the canvas call below
             is the one that matters. */
        }
        if (document.activeElement !== canvas) {
          canvas.focus({ preventScroll: true });
        }
      }

      // Browsers start an AudioContext suspended until a real user gesture.
      // GameMaker installs its own unlock listener on document.body, but resume
      // it directly too so a click on the gate is always enough.
      function unlockAudio() {
        try {
          var ctx = window.g_WebAudioContext;
          if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
            ctx.resume();
          }
        } catch (e) {
          /* Audio staying locked must never stop the game from starting. */
        }
      }

      function start() {
        if (started) {
          return;
        }
        started = true;
        gate.hidden = true;
        unlockAudio();
        takeFocus();
      }

      GameMaker_Init();

      // The runtime positions the canvas absolutely but leaves its size to the
      // width/height attributes, so it rendered at a native 480x432 postage
      // stamp in the middle of the frame. Stretch it to the container, which is
      // already locked to the game's 10:9 aspect, and keep the pixel grid sharp.
      // Inline styles are set here because the runtime's own inline positioning
      // cannot be overridden from the stylesheet.
      function fitCanvas() {
        canvas.style.position = "absolute";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.right = "0";
        canvas.style.bottom = "0";
        canvas.style.transform = "none";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      }

      fitCanvas();
      // The runtime re-applies its own layout on resize and fullscreen changes,
      // so re-assert afterwards rather than only once at startup.
      window.addEventListener("resize", function () { setTimeout(fitCanvas, 0); });
      document.addEventListener("fullscreenchange", function () { setTimeout(fitCanvas, 0); });

      gate.addEventListener("click", start);

      // Any click inside the frame re-arms input, not just one on the canvas.
      document.addEventListener("pointerdown", function () {
        if (started) {
          takeFocus();
        }
      });

      // Keyboard is genuinely dead while this document is blurred, so tell the
      // player instead of letting it look like a freeze.
      window.addEventListener("focus", function () {
        if (started) {
          focusHint.hidden = true;
          takeFocus();
        }
      });
      window.addEventListener("blur", function () {
        if (started) {
          focusHint.hidden = false;
        }
      });
    });
  </script>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id || !session.user.emailVerified) {
    return new NextResponse("Authentication required.", { status: 401 });
  }

  const access = await getGameLaunchAccess(session.user);
  if (!access.allowed) {
    return new NextResponse(access.message ?? "Game access denied.", { status: 403 });
  }

  const instanceId = getGameInstanceId(session.user.id, "dd-project");
  return new NextResponse(runtimeHtml(instanceId), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
    },
  });
}
