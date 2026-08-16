/**
 * Same-origin Web Worker shim.
 *
 * Browsers refuse to instantiate a classic Worker directly from a
 * cross-origin script URL, so this tiny same-origin file exists purely to
 * `importScripts()` the real engine from cdnjs (importScripts is not subject
 * to that restriction). Everything else -- the UCI protocol, search, etc. --
 * lives entirely inside the imported engine; this file adds no logic of its
 * own so there's nothing here to maintain as the engine is updated.
 *
 * Engine: stockfish.js 10.0.2 (niklasf/lichess-org build), single-threaded
 * asm.js/WASM hybrid. Chosen deliberately over newer multi-threaded builds
 * because those require cross-origin-isolation (COOP/COEP) response headers
 * that GitHub Pages cannot set, which would break the engine in production.
 */
var wasmSupported =
  typeof WebAssembly === "object" &&
  WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

importScripts(
  wasmSupported
    ? "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.wasm.min.js"
    : "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.min.js"
);
