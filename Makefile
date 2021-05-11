static/bundle.js: $(shell find build -type f)
	npx browserify build/app.js -o static/bundle.js

build/app.js: $(shell find src -type f)
	npx tsc
