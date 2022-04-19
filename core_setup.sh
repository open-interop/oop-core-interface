#!/bin/bash

bundle exec rails db:create

bundle exec rails db:migrate

bin/rails runner "account = Account.create(name: 'Test Account', hostname: 'host.docker.internal'); user = User.create(email: 'test@example.com', password: 'Password123', password_confirmation: 'Password123', account: account, time_zone: 'UTC')"