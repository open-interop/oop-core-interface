#!/bin/bash

docker exec -it oop-core bundle exec rails db:create

docker exec -it oop-core bundle exec rails db:migrate

docker exec -it oop-core bin/rails runner "account = Account.create(name: 'Test Account', hostname: 'host.docker.internal'); user = User.create(email: 'test@example.com', password: 'Password123', password_confirmation: 'Password123', account: account, time_zone: 'UTC')"