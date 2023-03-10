#!/bin/sh

set -e

emcmake cmake \
    -Wno-dev \
    -DLLVM_TARGETS_TO_BUILD=WebAssembly \
    -DLLVM_BUILD_TOOLS=OFF \
    -DLLVM_ENABLE_PROJECTS=lld \
    -DCMAKE_CXX_FLAGS="-sERROR_ON_UNDEFINED_SYMBOLS=0 -Wno-unused-command-line-argument" \
    -DCMAKE_BUILD_TYPE=Release \
    -GNinja \
    -S llvm-project/llvm \
    -B build-emscripten

ninja -j8 -C build-emscripten

node build.mjs

emcc src/everything.c \
  build-emscripten/lib/libLLVM*.a \
  -s EXPORTED_FUNCTIONS=@llvm.exports \
  -o build/llvm.mjs \
  -s STANDALONE_WASM \
  -I build-emscripten/include \
  -I llvm-project/llvm/include \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  -sWASM_BIGINT \
  -O3

node --experimental-wasm-bigint ./index.mjs

# em++ \
#     src/bindings.cpp \
#     build-emscripten/lib/libLLVM*.a \
#     -I build-emscripten/include \
#     -I llvm-project/llvm/include \
#     -lembind \
#     -o build/bindings.mjs \
#     -Oz \
#     -sWASM_BIGINT \
#     -s STANDALONE_WASM \
#     -sERROR_ON_UNDEFINED_SYMBOLS=0 \
#     --no-entry