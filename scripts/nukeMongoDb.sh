#!/bin/bash
# For development purpose only
mongo localhost/web-grep <<EOF
db.dropDatabase()
EOF
rm -rf /tmp/web-grep