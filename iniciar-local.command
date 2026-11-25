#!/bin/zsh
set -eu
cd "${0:A:h}"
if [[ -d "$HOME/.local/share/andina/jdk/Contents/Home" ]]; then
    export JAVA_HOME="$HOME/.local/share/andina/jdk/Contents/Home"
fi
if [[ -x "$HOME/.local/share/andina/maven/bin/mvn" ]]; then
    export PATH="$HOME/.local/share/andina/maven/bin:$PATH"
fi
if [[ ! -x frontend/node_modules/.bin/astro ]]; then
    npm --prefix frontend ci
fi
exec mvn spring-boot:run -Dspring-boot.run.profiles=local
