/**
 * Same-origin Web Worker shim.
 *
 * Browsers refuse to instantiate a classic Worker directly from a
 * cross-origin script URL, so this tiny same-origin file exists purely to
 * `importScripts()` the real engine from cdnjs (importScripts is not subject
 * to that restriction).
 *
 * Engine: stockfish.js 10.0.2 (lichess-org/niklasf build), asm.js flavour.
 *
 * Why asm.js and not the WASM build: the `stockfish.wasm.min.js` file is
 * only a loader -- at runtime it fetches a separate `stockfish.wasm`
 * binary, and Emscripten resolves that path relative to the *worker's own
 * origin* (this site), not relative to the CDN it was imported from. On a
 * static host that means a request for /assets/js/chess/stockfish.wasm,
 * which 404s, so the engine dies silently before ever answering `uci`.
 * The asm.js build is a single self-contained file with no companion
 * binary, so it has no such path dependency. It's somewhat slower than
 * WASM, but every difficulty level here is bounded by an explicit
 * `movetime`, so search time is capped regardless.
 */
importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.min.js");
