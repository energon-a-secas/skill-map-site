.DEFAULT_GOAL := help

PORT = 8777

# ── Help ──────────────────────────────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "  make setup     First-time: npm install + deploy Convex functions"
	@echo "  make dev       Run Convex dev watcher (terminal 1)"
	@echo "  make serve     Start dev server → http://localhost:$(PORT) (terminal 2)"
	@echo "  make deploy    Deploy Convex functions to production"
	@echo "  make kill      Kill this project's HTTP server"
	@echo ""

# ── Setup ─────────────────────────────────────────────────────────────────────
.PHONY: setup
setup:
	@echo "Installing dependencies..."
	@npm install
	@echo "Deploying Convex functions..."
	@npx convex deploy

# ── Convex dev ────────────────────────────────────────────────────────────────
.PHONY: dev
dev:
	@echo "Starting Convex dev watcher..."
	@npx convex dev

# ── Deploy ────────────────────────────────────────────────────────────────────
.PHONY: deploy
deploy:
	@echo "Deploying Convex functions to production..."
	@npx convex deploy

# ── Dev server ────────────────────────────────────────────────────────────────
.PHONY: serve
serve:
	@echo "Serving → http://localhost:$(PORT)"
	@python3 -m http.server $(PORT)

# ── Kill ──────────────────────────────────────────────────────────────────────
.PHONY: kill
kill:
	@lsof -ti :$(PORT) | xargs kill 2>/dev/null && echo "Stopped server on port $(PORT)" || echo "No server running on port $(PORT)"
