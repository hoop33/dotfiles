#!/usr/bin/env bash

# From https://sharats.me/posts/shell-script-best-practices/

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

if [[ "${1-}" =~ ^-*h(elp)?$ ]]; then
  echo 'Usage: '
  exit
fi

cd "$(dirname "$0")"

main() {
  echo "do stuff here"
}

main "$@"
