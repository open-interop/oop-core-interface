cat > .env <<EOF
PROXY=http://host.docker.internal:9001
PORT=3001
EOF

yarn start &