# RouteSort Development Makefile
# Common commands for development workflow

.PHONY: help install dev build test lint clean migrate seed docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install all dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build all workspaces
	npm run build

test: ## Run all tests
	npm run test

lint: ## Run linter
	npm run lint

clean: ## Clean build artifacts and node_modules
	rm -rf node_modules
	rm -rf apps/web/.next
	rm -rf apps/web/node_modules
	rm -rf packages/*/node_modules
	rm -rf packages/*/dist
	rm -rf services/*/node_modules
	rm -rf services/*/dist

migrate: ## Run database migrations
	@echo "Running database migrations..."
	@if [ -z "$$DATABASE_URL" ]; then \
		echo "Error: DATABASE_URL environment variable not set"; \
		exit 1; \
	fi
	psql $$DATABASE_URL -f schema.sql

seed: ## Seed database with sample data
	@echo "Seeding database..."
	@if [ -z "$$DATABASE_URL" ]; then \
		echo "Error: DATABASE_URL environment variable not set"; \
		exit 1; \
	fi
	psql $$DATABASE_URL -f infra/seed.sql

docker-up: ## Start Docker services (PostgreSQL, Redis)
	docker-compose -f infra/docker-compose.yml up -d

docker-down: ## Stop Docker services
	docker-compose -f infra/docker-compose.yml down

docker-logs: ## View Docker logs
	docker-compose -f infra/docker-compose.yml logs -f

setup: install docker-up migrate seed ## Complete local setup (install, docker, migrate, seed)
	@echo "✅ Setup complete! Run 'make dev' to start the development server."
