---
layout: page
permalink: /chess/
title: chess
description: Play chess against a Stockfish-powered opponent, right in your browser.
nav: true
nav_order: 2
---

<div class="cp-hero-eyebrow" style="margin-bottom:1.5rem;">interactive // live engine, runs entirely in your browser</div>

<div id="chess-app" class="cp-chess" data-worker-src="{{ '/assets/js/chess/stockfish-worker.js' | relative_url }}">
  <div class="cp-chess-board-col">
    <div id="chess-board" class="cp-board" role="grid" aria-label="Chess board"></div>

    <div id="promotion-picker" class="cp-promotion hud-panel" hidden>
      <span class="cp-captured-label">Promote to:</span>
      <button type="button" class="btn-cp" data-promotion="q">Queen</button>
      <button type="button" class="btn-cp" data-promotion="r">Rook</button>
      <button type="button" class="btn-cp" data-promotion="b">Bishop</button>
      <button type="button" class="btn-cp" data-promotion="n">Knight</button>
    </div>
  </div>

  <div class="cp-chess-panel hud-panel">
    <div id="chess-status" class="cp-chess-status"><span class="status-dot warn"></span>Loading engine&hellip;</div>

    <div class="cp-chess-controls">
      <label class="cp-control">
        <span class="hud-label">Play as</span>
        <select id="side-select" class="cp-select">
          <option value="w" selected>White</option>
          <option value="b">Black</option>
        </select>
      </label>

      <label class="cp-control">
        <span class="hud-label">Difficulty</span>
        <select id="difficulty-select" class="cp-select"></select>
      </label>

      <div class="cp-control-buttons">
        <button type="button" id="new-game-btn" class="btn-cp">New Game</button>
        <button type="button" id="restart-btn" class="btn-cp btn-cp-magenta">Restart</button>
      </div>
    </div>

    <div class="cp-chess-captured">
      <div id="captured-white" class="cp-captured-row"></div>
      <div id="captured-black" class="cp-captured-row"></div>
    </div>

    <div class="hud-label" style="margin-top:1rem;">Move history</div>
    <div id="move-history" class="cp-history"></div>
  </div>
</div>

<noscript>
  <p>This chess board needs JavaScript enabled to run &mdash; please enable it and reload the page.</p>
</noscript>

<script type="module" src="{{ '/assets/js/chess/chess-app.js' | relative_url }}"></script>
