#!/bin/sh

# Ejecuta el exportador con la instalacion local de Node.js del repositorio.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
NODE="$SCRIPT_DIR/../../../.tools/node-v22.23.1-darwin-x64/bin/node"

if [ ! -x "$NODE" ]; then
  echo "Error: no se encontro Node.js local en $NODE" >&2
  exit 1
fi

exec "$NODE" "$SCRIPT_DIR/exportar_folletos.js" "$@"
