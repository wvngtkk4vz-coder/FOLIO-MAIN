#!/bin/bash
# Rebuilds index.html from the files in src/
cd "$(dirname "$0")"
cat src/01-head.html src/02-css.css src/03-body.html $(ls src/*.js | sort) src/99-tail.html > index.html
echo "Built index.html"
