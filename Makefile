all: static/bundle.js static/modules/imagemagick.js

static/bundle.js: build/app.js $(shell find build -type f)
	npx browserify -p [ partition-bundle --map mapping.json --output static --main ./build/app.js ]

build/app.js: $(shell find src -type f)
	npx tsc

static/modules/imagemagick.js: build/modules/imagemagick.js
	npx browserify -r build/modules/imagemagick.js -o static/modules/imagemagick.js
