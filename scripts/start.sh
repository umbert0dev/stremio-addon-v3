#!/bin/sh

npx puppeteer browsers install chrome
echo "👤 Current user: $(whoami)"
lscpu
npm start