#!/bin/bash

cat > .env <<EOF
PROXY=http://localhost:9001
PORT=3001
EOF

yarn start &