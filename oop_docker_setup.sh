#!/bin/bash

cat > docker-compose.yml <<EOF
version: '3'

services:
  oop-core:
    image: "openinterop/oop-core:latest"
    ports:
      - "9001:9001"
    env_file:
      - all.env
    depends_on:
      - database
    volumes:
      - gem_cache:/gems

  oop-gateway:
    image: "openinterop/oop-gateway:latest"
    ports:
      - "3000:3000"
    env_file:
      - all.env

  oop-authenticator:
    image: "openinterop/oop-authenticator:latest"
    env_file:
      - all.env
    depends_on:
      - oop-core

  oop-tempr:
    image: "openinterop/oop-tempr:latest"
    env_file:
      - all.env

  oop-renderer:
    image: "openinterop/oop-renderer:latest"
    env_file:
      - all.env

  oop-endpoints-http:
    image: "openinterop/oop-endpoints-http:latest"
    env_file:
      - all.env

  oop-relay:
    image: "openinterop/oop-relay:latest"
    env_file:
      - all.env

  database:
    image: postgres
    env_file:
      - all.env
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
  gem_cache:
EOF

cat > all.env <<EOF
NODE_ENV=production
RAILS_ENV=production

# All repos
OOP_AMQP_ADDRESS=amqp://guest:guest@host.docker.internal
RABBITMQ_URL=amqp://guest:guest@host.docker.internal
OOP_ERROR_EXCHANGE_NAME=oop.errors
OOP_JSON_ERROR_Q=oop.errors.json
OOP_EXCHANGE_NAME=oop
OOP_QUEUE_PREFETCH_LIMIT=5

# Gateway
OOP_GATEWAY_OUTPUT_Q=oop.noauth.raw_messages
OOP_LISTEN_PORT=3000

# Authenticator
OOP_AUTHENTICATOR_INPUT_Q=oop.noauth.raw_messages
OOP_AUTHENTICATOR_OUTPUT_Q=oop.hasauth.messages
OOP_CORE_TOKEN=foobar
OOP_CORE_DEVICE_UPDATE_EXCHANGE=oop.core.devices

# Tempr
OOP_TEMPR_INPUT_Q=oop.hasauth.messages
OOP_TEMPR_OUTPUT_Q=oop.hasauth.temprs
OOP_CORE_API_URL=http://host.docker.internal:9001/services/v1

# Scheduler
OOP_SCHEDULER_OUTPUT_Q=oop.hasauth.messages

# Renderer
OOP_RENDERER_INPUT_Q=oop.hasauth.temprs
OOP_ENDPOINTS_EXCHANGE_NAME=oop.endpoints
OOP_ENDPOINT_Q=oop.endpoints

# Endpoints HTTP
OOP_ENDPOINTS_HTTP_OUTPUT_Q=oop.hasauth.relay
OOP_REQUEST_TIMEOUT=1000
OOP_ENDPOINTS_HTTP_MAX_RETRIES=3

# Relay
OOP_RELAY_INPUT_Q=oop.hasauth.relay
OOP_RECURSIVE_TEMPR_Q=oop.hasauth.temprs
OOP_CORE_RESPONSE_Q=oop.core.transmissions

# Core
OOP_AMQP_ADDRESS=amqp://host.docker.internal
OOP_RENDERER_PATH=/Users/jack/Projects/OOO/oop-renderer

OOP_CORE_SCHEME=http://
OOP_CORE_PORT=9001
OOP_CORE_PATH=/

PORT=9001

OOP_CORE_INTERFACE_SCHEME=http://
OOP_CORE_INTERFACE_PORT=80
OOP_CORE_INTERFACE_PATH=/
OOP_CORE_FROM_ADDRESS=oop@bluefrontier.co.uk

DATABASE_HOST=host.docker.internal
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=oop_core_development

SECRET_KEY_BASE=RCvxQdmiR2YVu3qmgtt3oLNNKf7aFNFavuW7UjJc8HaKVQtA6Xo4HWHt399DkvF8
EOF

mkdir config

cat > config/storage.yml <<EOF
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>
EOF

cat > config/database.yml <<EOF
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: <%= ENV.fetch('DATABASE_HOST') %>
  username: <%= ENV.fetch('POSTGRES_USER') %>
  password: <%= ENV.fetch('POSTGRES_PASSWORD') %>
  database: <%= ENV.fetch('POSTGRES_DB') %>
  variables:
    statement_timeout: 5000

production:
  <<: *default
EOF

cat > config/secrets.yml <<EOF
production:
  secret_key_base: <%= ENV["SECRET_KEY_BASE"] %>
EOF

#docker-compose up -d

docker cp config repo_oop-core_1:app/config/

cat /app/config/database.yml

#docker exec -it repo_oop-core_1 bundle exec rails db:create

#docker exec -it repo_oop-core_1 bundle exec rails db:migrate

#docker exec -it repo_oop-core_1 bin/rails open_interop:setup_initial_account
