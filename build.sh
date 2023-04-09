#!/bin/sh

set -e

emcmake cmake \
    -Wno-dev \
    -DLLVM_TARGETS_TO_BUILD=WebAssembly \
    -DLLVM_ENABLE_PROJECTS=lld \
    -DCMAKE_CXX_FLAGS="-sASSERTIONS -sERROR_ON_UNDEFINED_SYMBOLS=0 -Wno-unused-command-line-argument -sINVOKE_RUN=0 -sEXPORTED_FUNCTIONS=_main,_malloc,_free -sEXPORTED_RUNTIME_METHODS=FS,stringToUTF8,UTF8ToString --oformat=mjs" \
    -DCMAKE_BUILD_TYPE=Release \
    -GNinja \
    -S llvm-project/llvm \
    -B build-emscripten

ninja -C build-emscripten

find build-emscripten/bin \
    -type f \
    '(' \
        -path '*.wasm' -or \
        -path '*.js' \
    ')' \
    -exec cp '{}' build ';'

node build.mjs

emcc src/everything.c \
  build-emscripten/lib/libLLVM*.a \
  build-emscripten/lib/liblld*.a \
  build-emscripten/lib/libLTO.a \
  -s EXPORTED_FUNCTIONS=@llvm.exports \
  -o build/llvm-wasm.mjs \
  -s STANDALONE_WASM \
  -I build-emscripten/include \
  -I llvm-project/llvm/include \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  -sWASM_BIGINT \
  --no-entry \
  -O3

npx tsc