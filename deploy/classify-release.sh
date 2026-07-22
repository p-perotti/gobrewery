#!/bin/sh
set -eu

executable=false
while IFS= read -r path; do
  [ -n "$path" ] || continue
  case "$path" in
    *.md) ;;
    *) executable=true; break ;;
  esac
done
printf '%s\n' "$executable"
