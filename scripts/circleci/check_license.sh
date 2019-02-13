#!/bin/bash

set -e

# Make sure we don't introduce accidental references to PATENTS.
EXPECTED='Folly/folly/experimental/DynamicParser-inl.h\nFolly/folly/experimental/DynamicParser.cpp\nFolly/folly/experimental/DynamicParser.h\nFolly/folly/experimental/test/DynamicParserTest.cpp\nscripts/circleci/check_license.sh'
ACTUAL=$(git grep -l PATENTS)

if [ "$EXPECTED" != "$ACTUAL" ]; then
  echo "PATENTS crept into some new files?"
  diff -u <(echo -e "$EXPECTED") <(echo "$ACTUAL") || true
  exit 1
fi
