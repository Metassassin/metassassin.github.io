/**
 * Cyberpunk chess page.
 *
 * Rules / legal-move / check / checkmate / stalemate detection: chess.js
 * (loaded as an ES module straight from jsDelivr, pointed at the package's
 * own published ESM build (dist/esm/chess.js) rather than jsDelivr's
 * auto-generated `+esm` conversion -- the latter proved unreliable at
 * re-exporting the named `Chess` class and silently broke the whole page,
 * since a failed top-level import aborts the entire module before any
 * setup code -- including UI wiring -- gets a chance to run).
 *
 * Opponent: Stockfish, running in a Web Worker (assets/js/chess/stockfish-worker.js)
 * so the UI thread never blocks, even at the highest difficulty.
 */
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js";

const PIECE_GLYPHS = {
  p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚",
  P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕", K: "♔",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

const DIFFICULTIES = [
  { id: "rookie", label: "Rookie", skill: 0, depth: 3, movetime: 250, blunderChance: 0.3 },
  { id: "easy", label: "Easy", skill: 4, depth: 5, movetime: 450, blunderChance: 0.12 },
  { id: "normal", label: "Normal", skill: 8, depth: 8, movetime: 700, blunderChance: 0 },
  { id: "hard", label: "Hard", skill: 12, depth: 11, movetime: 1100, blunderChance: 0 },
  { id: "expert", label: "Expert", skill: 16, depth: 14, movetime: 1700, blunderChance: 0 },
  { id: "nightmare", label: "Nightmare", skill: 20, depth: 18, movetime: 2800, blunderChance: 0 },
];

class ChessApp {
  constructor(root) {
    this.root = root;
    this.game = new Chess();
    this.playerColor = "w";
    this.difficulty = DIFFICULTIES[2]; // Normal by default
    this.selectedSquare = null;
    this.legalTargets = [];
    this.engineReady = false;
    this.engineThinking = false;
    this.pendingPromotion = null; // { from, to }
    this.secretRevealed = false;

    this.boardEl = root.querySelector("#chess-board");
    this.statusEl = root.querySelector("#chess-status");
    this.sideSelect = root.querySelector("#side-select");
    this.difficultySelect = root.querySelector("#difficulty-select");
    this.newGameBtn = root.querySelector("#new-game-btn");
    this.restartBtn = root.querySelector("#restart-btn");
    this.historyEl = root.querySelector("#move-history");
    this.capturedWhiteEl = root.querySelector("#captured-white");
    this.capturedBlackEl = root.querySelector("#captured-black");
    this.promoEl = root.querySelector("#promotion-picker");

    this.buildDifficultyOptions();
    this.buildBoardSquares();
    this.attachControlListeners();
    this.initEngine();
    this.setStatus("Loading engine\u2026 (first load downloads ~1MB)", "warn");
    this.render();
  }

  // ---------------------------------------------------------------------
  // Setup
  // ---------------------------------------------------------------------
  buildDifficultyOptions() {
    this.difficultySelect.innerHTML = DIFFICULTIES.map(
      (d, i) => `<option value="${d.id}" ${i === 2 ? "selected" : ""}>${d.label}</option>`
    ).join("");
  }

  buildBoardSquares() {
    this.boardEl.innerHTML = "";
    this.squareEls = {};
    const ranks = this.playerColor === "w" ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
    const files = this.playerColor === "w" ? FILES : [...FILES].reverse();

    ranks.forEach((rank) => {
      files.forEach((file) => {
        const square = `${file}${rank}`;
        const isLight = (FILES.indexOf(file) + rank) % 2 === 1;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `cp-square ${isLight ? "cp-light" : "cp-dark"}`;
        btn.dataset.square = square;
        btn.setAttribute("aria-label", square);
        btn.addEventListener("click", () => this.onSquareClick(square));
        this.boardEl.appendChild(btn);
        this.squareEls[square] = btn;
      });
    });
  }

  attachControlListeners() {
    this.sideSelect.addEventListener("change", () => {
      this.newGame(this.sideSelect.value);
    });

    this.difficultySelect.addEventListener("change", () => {
      this.difficulty = DIFFICULTIES.find((d) => d.id === this.difficultySelect.value) || this.difficulty;
      this.configureEngineOptions();
    });

    this.newGameBtn.addEventListener("click", () => this.newGame(this.sideSelect.value));
    this.restartBtn.addEventListener("click", () => this.newGame(this.playerColor));
  }

  initEngine() {
    try {
      this.engine = new Worker(
        this.root.dataset.workerSrc || "/assets/js/chess/stockfish-worker.js"
      );
    } catch (err) {
      this.setStatus("Engine failed to load \u2014 try refreshing.", "danger");
      return;
    }

    this.engine.onerror = (err) => {
      console.error("[chess] Worker error:", err && (err.message || err));
      this.setStatus("Engine error \u2014 try refreshing the page.", "danger");
    };

    this.engine.onmessage = (e) => this.onEngineMessage(e.data);
    this.engine.postMessage("uci");

    // If the engine never confirms readiness, don't fail silently --
    // surface it so it's diagnosable from the page/console instead of
    // just looking like the AI is doing nothing forever. The asm.js
    // engine build is a large single file that has to download and
    // compile, so this is deliberately generous on slow connections.
    this.uciokWatchdog = setTimeout(() => {
      if (!this.engineReady) {
        console.error(
          "[chess] Stockfish never replied to 'uci' within 25s -- engine did not load correctly."
        );
        this.setStatus(
          "Engine failed to start \u2014 open the console (F12) for details, or try refreshing.",
          "danger"
        );
      }
    }, 25000);
  }

  onEngineMessage(raw) {
    // Different Stockfish builds are inconsistent about batching: some
    // send one UCI line per postMessage, others send several lines
    // (newline-separated) in a single message, sometimes with trailing
    // whitespace. Splitting defensively here avoids a strict-equality
    // check silently never matching and leaving engineReady stuck false
    // forever (which would make the engine look like it's just not
    // moving, for either color).
    String(raw)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => this.handleEngineLine(line));
  }

  handleEngineLine(line) {
    console.debug("[stockfish]", line);

    if (line === "uciok") {
      clearTimeout(this.uciokWatchdog);
      this.configureEngineOptions();
      this.engine.postMessage("isready");
      return;
    }

    if (line === "readyok") {
      this.engineReady = true;
      this.setStatus(this.turnLabel(), "ok");
      this.maybeTriggerEngineMove();
      return;
    }

    if (line.startsWith("bestmove")) {
      const parts = line.split(" ");
      const uciMove = parts[1];
      this.engineThinking = false;
      if (uciMove && uciMove !== "(none)") {
        this.applyEngineMove(uciMove);
      }
    }
  }

  configureEngineOptions() {
    if (!this.engine) return;
    this.engine.postMessage(`setoption name Skill Level value ${this.difficulty.skill}`);
  }

  // ---------------------------------------------------------------------
  // Game lifecycle
  // ---------------------------------------------------------------------
  newGame(side) {
    this.game = new Chess();
    this.playerColor = side === "b" ? "b" : "w";
    this.selectedSquare = null;
    this.legalTargets = [];
    this.pendingPromotion = null;
    this.secretRevealed = false;
    this.hidePromotionPicker();
    this.buildBoardSquares();
    this.render();
    this.renderHistory();
    this.renderCaptured();
    this.setStatus(this.turnLabel(), "ok");
    this.maybeTriggerEngineMove();
  }

  turnLabel() {
    if (this.game.isCheckmate()) {
      const winner = this.game.turn() === "w" ? "Black" : "White";
      return `Checkmate \u2014 ${winner} wins`;
    }
    if (this.game.isStalemate()) return "Stalemate \u2014 draw";
    if (this.game.isThreefoldRepetition()) return "Draw \u2014 threefold repetition";
    if (this.game.isInsufficientMaterial()) return "Draw \u2014 insufficient material";
    if (this.game.isDraw()) return "Draw";
    const turn = this.game.turn() === "w" ? "White" : "Black";
    const you = this.game.turn() === this.playerColor;
    const check = this.game.isCheck() ? " \u2014 check!" : "";
    return `${turn} to move${you ? " (you)" : " (engine)"}${check}`;
  }

  setStatus(text, kind) {
    const dotClass = kind === "danger" ? "danger" : kind === "warn" ? "warn" : "";
    this.statusEl.innerHTML = `<span class="status-dot ${dotClass}"></span>${text}`;
  }

  isGameOver() {
    return this.game.isGameOver();
  }

  maybeTriggerEngineMove() {
    if (!this.engineReady || this.isGameOver()) return;
    if (this.game.turn() !== this.playerColor) {
      this.requestEngineMove();
    }
  }

  // ---------------------------------------------------------------------
  // Player interaction
  // ---------------------------------------------------------------------
  onSquareClick(square) {
    if (this.isGameOver() || this.engineThinking) return;
    if (this.game.turn() !== this.playerColor) return;
    if (this.pendingPromotion) return;

    const piece = this.game.get(square);

    if (this.selectedSquare) {
      if (this.legalTargets.includes(square)) {
        this.attemptMove(this.selectedSquare, square);
        return;
      }
      if (piece && piece.color === this.playerColor) {
        this.selectSquare(square);
        return;
      }
      this.clearSelection();
      return;
    }

    if (piece && piece.color === this.playerColor) {
      this.selectSquare(square);
    }
  }

  selectSquare(square) {
    this.selectedSquare = square;
    const moves = this.game.moves({ square, verbose: true });
    this.legalTargets = moves.map((m) => m.to);
    this.render();
  }

  clearSelection() {
    this.selectedSquare = null;
    this.legalTargets = [];
    this.render();
  }

  attemptMove(from, to) {
    const candidates = this.game.moves({ square: from, verbose: true }).filter((m) => m.to === to);
    if (!candidates.length) {
      this.clearSelection();
      return;
    }

    const needsPromotion = candidates.some((m) => m.promotion);
    if (needsPromotion) {
      this.pendingPromotion = { from, to };
      this.showPromotionPicker();
      return;
    }

    this.finishMove({ from, to });
  }

  finishMove({ from, to, promotion }) {
    let move;
    try {
      move = this.game.move({ from, to, promotion: promotion || undefined });
    } catch (err) {
      this.clearSelection();
      return;
    }
    if (!move) {
      this.clearSelection();
      return;
    }

    this.clearSelection();
    this.render();
    this.renderHistory();
    this.renderCaptured();
    this.setStatus(this.turnLabel(), "ok");
    this.checkForWinSecret();

    if (!this.isGameOver()) {
      this.requestEngineMove();
    }
  }

  showPromotionPicker() {
    this.promoEl.hidden = false;
  }

  hidePromotionPicker() {
    if (this.promoEl) this.promoEl.hidden = true;
  }

  choosePromotion(piece) {
    const pending = this.pendingPromotion;
    this.pendingPromotion = null;
    this.hidePromotionPicker();
    if (!pending) return;
    this.finishMove({ from: pending.from, to: pending.to, promotion: piece });
  }

  // ---------------------------------------------------------------------
  // Engine moves
  // ---------------------------------------------------------------------
  requestEngineMove() {
    if (!this.engine || !this.engineReady) return;
    this.engineThinking = true;
    this.setStatus(`${this.game.turn() === "w" ? "White" : "Black"} (engine) is thinking\u2026`, "warn");
    this.engine.postMessage("position fen " + this.game.fen());
    this.engine.postMessage(`go depth ${this.difficulty.depth} movetime ${this.difficulty.movetime}`);
  }

  applyEngineMove(uciMove) {
    const from = uciMove.slice(0, 2);
    const to = uciMove.slice(2, 4);
    const promotion = uciMove.length > 4 ? uciMove.slice(4, 5) : undefined;

    // Weaker tiers occasionally play a random legal move instead of the
    // engine's choice, so "Rookie"/"Easy" feel genuinely beatable rather
    // than just "Stockfish with a lower number attached".
    let finalFrom = from;
    let finalTo = to;
    let finalPromotion = promotion;

    if (this.difficulty.blunderChance > 0 && Math.random() < this.difficulty.blunderChance) {
      const legal = this.game.moves({ verbose: true });
      if (legal.length) {
        const pick = legal[Math.floor(Math.random() * legal.length)];
        finalFrom = pick.from;
        finalTo = pick.to;
        finalPromotion = pick.promotion;
      }
    }

    let move;
    try {
      move = this.game.move({ from: finalFrom, to: finalTo, promotion: finalPromotion || undefined });
    } catch (err) {
      // Fall back to the engine's original (legal) choice if the random
      // substitution somehow produced an illegal move.
      try {
        move = this.game.move({ from, to, promotion: promotion || undefined });
      } catch (err2) {
        move = null;
      }
    }

    if (!move) return;

    this.render();
    this.renderHistory();
    this.renderCaptured();
    this.setStatus(this.turnLabel(), "ok");
    this.checkForWinSecret();
  }

  // ---------------------------------------------------------------------
  // Easter egg: beat the engine, find a note in the inspector
  // ---------------------------------------------------------------------
  checkForWinSecret() {
    if (this.secretRevealed) return;
    if (!this.game.isCheckmate()) return;
    // At checkmate, game.turn() is the side that's stuck (the loser).
    // If that isn't the player, the player just won.
    if (this.game.turn() === this.playerColor) return;

    this.secretRevealed = true;
    this.revealSecret();
  }

  revealSecret() {
    // Edit SECRET_MESSAGE to whatever you'd like this to say -- it's
    // dropped into the page as a hidden HTML comment the moment you
    // checkmate the engine, findable by anyone who opens devtools and
    // inspects the DOM (Elements panel) after a win.
    const SECRET_MESSAGE =
      "⠴⠂⠂⠴⠴⠴⠴⠂⠀⠴⠂⠴⠴⠂⠴⠴⠴⠀⠴⠂⠴⠂⠴⠴⠂⠴⠀⠴⠴⠂⠂⠴⠴⠴⠴⠀⠴⠂⠂⠴⠴⠴⠂⠂⠀⠴⠂⠴⠴⠂⠴⠴⠴⠀⠴⠂⠴⠴⠂⠂⠴⠂⠀⠴⠴⠂⠂⠴⠂⠂⠴⠀⠴⠂⠴⠴⠂⠂⠴⠴⠀⠴⠂⠂⠂⠂⠴⠴⠂⠀⠴⠴⠂⠂⠂⠴⠴⠂⠀⠴⠴⠂⠂⠴⠴⠂⠂⠀⠴⠂⠴⠂⠂⠴⠂⠴⠀⠴⠂⠴⠂⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠴⠴⠂⠀⠴⠂⠂⠂⠴⠂⠴⠂⠀⠴⠂⠴⠂⠂⠴⠴⠂⠀⠴⠂⠴⠂⠂⠴⠴⠴⠀⠴⠂⠴⠴⠂⠴⠂⠴⠀⠴⠂⠂⠴⠂⠴⠂⠴⠀⠴⠂⠂⠴⠴⠴⠴⠂⠀⠴⠂⠴⠴⠴⠂⠂⠂⠀⠴⠂⠂⠴⠂⠂⠴⠴⠀⠴⠴⠂⠂⠴⠴⠂⠴⠀⠴⠂⠴⠂⠂⠴⠂⠴⠀⠴⠂⠴⠂⠴⠴⠂⠂⠀⠴⠴⠂⠂⠴⠂⠴⠂⠀⠴⠂⠂⠂⠴⠂⠂⠴⠀⠴⠂⠂⠴⠴⠴⠂⠂⠀⠴⠂⠂⠴⠂⠂⠴⠂⠀⠴⠂⠂⠴⠴⠴⠂⠂⠀⠴⠂⠂⠂⠴⠂⠂⠴⠀⠴⠂⠂⠴⠴⠂⠴⠴⠀⠴⠴⠂⠂⠴⠴⠂⠴⠀⠴⠂⠴⠂⠴⠂⠂⠴⠀⠴⠂⠂⠴⠂⠴⠴⠂⠀⠴⠂⠴⠴⠂⠂⠴⠴⠀⠴⠂⠂⠂⠂⠴⠂⠴⠀⠴⠂⠴⠴⠂⠴⠴⠂⠀⠴⠂⠂⠂⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠂⠴⠂⠀⠴⠂⠂⠴⠂⠴⠂⠴⠀⠴⠂⠴⠂⠴⠴⠴⠂⠀⠴⠂⠂⠂⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠂⠴⠂⠀⠴⠂⠴⠴⠴⠂⠴⠴⠀⠴⠂⠴⠴⠴⠴⠴⠂⠀⠴⠂⠂⠂⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠂⠴⠂⠀⠴⠂⠴⠴⠴⠂⠴⠴⠀⠴⠂⠴⠴⠴⠴⠴⠂⠀⠴⠂⠂⠂⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠂⠴⠂⠀⠴⠂⠴⠴⠴⠂⠴⠴⠀⠴⠂⠴⠴⠴⠴⠴⠂⠀⠴⠂⠂⠂⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠴⠂⠂⠀⠴⠂⠂⠴⠂⠴⠴⠂⠀⠴⠴⠂⠂⠂⠴⠴⠂⠀⠴⠂⠂⠴⠂⠂⠂⠂⠀⠴⠂⠂⠴⠴⠂⠴⠴⠀⠴⠂⠴⠴⠂⠴⠴⠴⠀⠴⠂⠴⠂⠴⠴⠂⠴⠀⠴⠂⠂⠂⠴⠂⠂⠂⠀⠴⠂⠂⠴⠴⠴⠂⠂⠀⠴⠂⠂⠂⠂⠴⠂⠴⠀⠴⠂⠂⠴⠂⠂⠂⠂⠀⠴⠂⠂⠂⠴⠂⠂⠴⠀⠴⠂⠴⠴⠂⠂⠴⠴⠀⠴⠴⠂⠂⠴⠴⠂⠴⠀⠴⠂⠂⠴⠴⠂⠴⠴⠀⠴⠂⠂⠂⠴⠴⠴⠴⠀⠴⠂⠂⠴⠴⠂⠴⠴⠀⠴⠂⠴⠴⠴⠂⠂⠂⠀⠴⠂⠂⠴⠂⠴⠴⠴⠀⠴⠴⠂⠂⠴⠴⠴⠂⠀⠴⠂⠴⠂⠂⠴⠴⠂⠀⠴⠂⠂⠴⠂⠴⠴⠂⠀⠴⠴⠂⠂⠴⠂⠴⠂⠀⠴⠂⠂⠴⠂⠴⠂⠴⠀⠴⠂⠂⠴⠴⠴⠂⠴⠀⠴⠴⠂⠂⠴⠴⠂⠴⠀⠴⠴⠂⠂⠴⠴⠴⠴⠀⠴⠂⠂⠂⠴⠂⠂⠴⠀⠴⠂⠴⠂⠴⠴⠂⠂⠀⠴⠂⠴⠴⠴⠂⠂⠂⠀⠴⠂⠴⠂⠴⠂⠂⠴⠀⠴⠂⠂⠂⠴⠴⠂⠂⠀⠴⠂⠂⠴⠴⠴⠂⠴⠀⠴⠂⠴⠴⠴⠂⠂⠂⠀⠴⠂⠴⠴⠂⠴⠂⠴⠀⠴⠂⠂⠂⠴⠂⠂⠴⠀⠴⠂⠂⠴⠴⠂⠴⠴⠀⠴⠂⠴⠂⠴⠂⠂⠂⠀⠴⠴⠂⠂⠴⠂⠴⠂⠀⠴⠂⠂⠴⠂⠴⠂⠂⠀⠴⠂⠂⠴⠴⠴⠴⠂⠀⠴⠂⠴⠂⠴⠂⠂⠂⠀⠴⠴⠂⠂⠴⠂⠴⠂⠀⠴⠂⠂⠴⠂⠂⠂⠴⠀⠴⠂⠴⠴⠂⠂⠴⠴⠀⠴⠴⠂⠂⠴⠴⠴⠂⠀⠴⠂⠴⠴⠂⠴⠂⠴⠀⠴⠂⠂⠴⠂⠂⠴⠴⠀⠴⠂⠂⠴⠴⠴⠂⠴⠀⠴⠂⠴⠴⠴⠂⠂⠂⠀⠴⠂⠂⠴⠂⠂⠴⠴⠀⠴⠂⠂⠴⠂⠴⠂⠴";
    document.body.appendChild(document.createComment(` ${SECRET_MESSAGE} `));
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------
  render() {
    const lastMove = this.game.history({ verbose: true }).slice(-1)[0];
    const kingInCheckSquare = this.findKingInCheckSquare();

    Object.keys(this.squareEls).forEach((square) => {
      const el = this.squareEls[square];
      const piece = this.game.get(square);
      el.textContent = piece ? PIECE_GLYPHS[piece.color === "w" ? piece.type.toUpperCase() : piece.type] : "";
      el.classList.toggle("cp-selected", square === this.selectedSquare);
      el.classList.toggle("cp-legal-target", this.legalTargets.includes(square));
      el.classList.toggle("cp-legal-capture", this.legalTargets.includes(square) && !!this.game.get(square));
      el.classList.toggle(
        "cp-last-move",
        !!lastMove && (square === lastMove.from || square === lastMove.to)
      );
      el.classList.toggle("cp-in-check", square === kingInCheckSquare);
      el.setAttribute(
        "aria-label",
        piece ? `${square}, ${piece.color === "w" ? "white" : "black"} ${piece.type}` : square
      );
    });
  }

  findKingInCheckSquare() {
    if (!this.game.isCheck()) return null;
    const turn = this.game.turn();
    const board = this.game.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const cell = board[r][f];
        if (cell && cell.type === "k" && cell.color === turn) {
          return `${FILES[f]}${8 - r}`;
        }
      }
    }
    return null;
  }

  renderHistory() {
    const verbose = this.game.history({ verbose: true });
    let rows = "";
    for (let i = 0; i < verbose.length; i += 2) {
      const moveNum = i / 2 + 1;
      const white = verbose[i] ? verbose[i].san : "";
      const black = verbose[i + 1] ? verbose[i + 1].san : "";
      rows += `<tr><td>${moveNum}.</td><td>${white}</td><td>${black}</td></tr>`;
    }
    this.historyEl.innerHTML = `<table class="cp-history-table"><tbody>${rows}</tbody></table>`;
    this.historyEl.scrollTop = this.historyEl.scrollHeight;
  }

  renderCaptured() {
    const verbose = this.game.history({ verbose: true });
    const capturedByWhite = []; // black pieces white has taken
    const capturedByBlack = []; // white pieces black has taken

    verbose.forEach((m) => {
      if (!m.captured) return;
      const glyph = m.color === "w" ? PIECE_GLYPHS[m.captured] : PIECE_GLYPHS[m.captured.toUpperCase()];
      if (m.color === "w") capturedByWhite.push(glyph);
      else capturedByBlack.push(glyph);
    });

    this.capturedWhiteEl.innerHTML = `<span class="cp-captured-label">White captured</span>${capturedByWhite.join(" ")}`;
    this.capturedBlackEl.innerHTML = `<span class="cp-captured-label">Black captured</span>${capturedByBlack.join(" ")}`;
  }
}

function bootChessApp() {
  const root = document.getElementById("chess-app");
  if (!root) return;
  window.__chessApp = new ChessApp(root);

  const picker = root.querySelector("#promotion-picker");
  if (picker) {
    picker.querySelectorAll("[data-promotion]").forEach((btn) => {
      btn.addEventListener("click", () => window.__chessApp.choosePromotion(btn.dataset.promotion));
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootChessApp);
} else {
  bootChessApp();
}
