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
  </style>
</head>
<body>
  <div class="gm4html5_div_class" id="gm4html5_div_id">
    <canvas id="canvas" width="480" height="432" tabindex="0" aria-label="DD Project game canvas">
      Your browser does not support HTML5 canvas.
    </canvas>
  </div>
  <script src="${assetRoot}DD-Project.js"></script>
  <script>
    window.__MIGUISANSON_GAME_INSTANCE__ = ${serializedInstance};
    g_GameMakerHTML5Dir = ${JSON.stringify(assetRoot)};
    window.addEventListener("load", function () {
      GameMaker_Init();
      var canvas = document.getElementById("canvas");
      canvas.focus();

      // Inside an iframe the game only receives keys once something in this
      // document holds focus. A click anywhere in the frame — not just precisely
      // on the canvas — hands focus back, so input is never silently dead.
      function grabFocus() {
        if (document.activeElement !== canvas) {
          canvas.focus();
        }
      }
      document.addEventListener("pointerdown", grabFocus);
      window.addEventListener("focus", grabFocus);
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
