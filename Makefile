rwildcard=$(foreach d,$(wildcard $(1:=/*)),$(call rwildcard,$d,$2) $(filter $(subst *,%,$2),$d))

SRC=$(call rwildcard,src,*.ts)
BUILD=$(call rwildcard,build,*.js)

all: static/bundle.js static/modules/imagemagick.js

static/bundle.js: build/app.js $(BUILD)
	npx browserify -p [ partition-bundle --map mapping.json --output static --main ./build/app.js ]

build/app.js: $(SRC)
	npx tsc

static/modules/imagemagick.js: build/modules/imagemagick.js
	npx browserify -r build/modules/imagemagick.js -o static/modules/imagemagick.js
