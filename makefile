# Variables
NODE_VERSION = 12
PG_DIR = $(HOME)/pgsql
DB_NAME = rema_db
DB_USER = rema_db_user
DB_PASSWORD = your_password
ENV_FILE = .env
ADMIN_NAME = your_admin_name
ADMIN_EMAIL = your_admin_email
BASE_URL = your_url

# Default target
.PHONY: all
all: setup_node setup_postgres init_db clone_repo install_dependencies configure_env run_app

# Step 1: Install Node.js and NVM
.PHONY: setup_node
setup_node:
	@echo "Setting up Node.js..."
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
	source ~/.bashrc && nvm install $(NODE_VERSION) && nvm alias default $(NODE_VERSION)
	@echo "Node.js setup completed."

# Step 2: Install PostgreSQL locally
.PHONY: setup_postgres
setup_postgres:
	@echo "Setting up PostgreSQL..."
	wget https://get.enterprisedb.com/postgresql/postgresql-13.3-2-linux-x64-binaries.tar.gz
	tar -xvzf postgresql-13.3-2-linux-x64-binaries.tar.gz
	mv pgsql $(PG_DIR)
	@echo 'export PATH=$(PG_DIR)/bin:$$PATH' >> ~/.bashrc
	source ~/.bashrc
	@echo "PostgreSQL setup completed."

# Step 3: Initialize PostgreSQL and create database
.PHONY: init_db
init_db:
	@echo "Initializing PostgreSQL..."
	initdb -D $(PG_DIR)/data
	pg_ctl -D $(PG_DIR)/data start
	createuser $(DB_USER)
	createdb $(DB_NAME)
	psql -c "ALTER USER $(DB_USER) WITH PASSWORD '$(DB_PASSWORD)';"
	@echo "Adding admin details..."
	psql -U $(DB_USER) -d $(DB_NAME) -c "INSERT INTO admin(name,email_id) VALUES ('$(ADMIN_NAME)', '$(ADMIN_EMAIL)');"
	@echo "Database initialized."

# Step 4: Clone the repository
.PHONY: clone_repo
clone_repo:
	@echo "Cloning the repository..."
	git clone https://github.com/shrutya22487/Submission_Tracker.git
	cd Submission_Tracker
	@echo "Repository cloned."

# Step 5: Install project dependencies
.PHONY: install_dependencies
install_dependencies:
	@echo "Installing project dependencies..."
	cd Submission_Tracker && npm install
	@echo "Dependencies installed."

# Step 6: Configure environment variables
.PHONY: configure_env
configure_env:
	@echo "Setting up environment variables..."
	echo "GOOGLE_CLIENT_ID=your_client_id" > $(ENV_FILE)
	echo "GOOGLE_CLIENT_SECRET=your_secret_key" >> $(ENV_FILE)
	echo "PG_USER=$(DB_USER)" >> $(ENV_FILE)
	echo "PG_HOST=localhost" >> $(ENV_FILE)
	echo "PG_DATABASE=$(DB_NAME)" >> $(ENV_FILE)
	echo "PG_PASSWORD=$(DB_PASSWORD)" >> $(ENV_FILE)
	echo "PG_PORT=5432" >> $(ENV_FILE)
	echo "BASE_URL=$(BASE_URL)" >> $(ENV_FILE)
	@echo "Environment variables configured."