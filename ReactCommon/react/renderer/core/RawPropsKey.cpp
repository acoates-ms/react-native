/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "RawPropsKey.h"

#include <cassert>
#include <cstring>

#include <react/renderer/core/RawPropsPrimitives.h>

namespace facebook {
namespace react {

void RawPropsKey::render(char *buffer, RawPropsPropNameLength *length)
    const noexcept {
  *length = 0;

  // Prefix
  if (prefix) {
    auto prefixLength = std::strlen(prefix);
    std::memcpy(buffer, prefix, prefixLength);
    *length = static_cast<RawPropsPropNameLength>(prefixLength);
  }

  // Name
  auto nameLength = std::strlen(name);
  std::memcpy(buffer + *length, name, nameLength);
  *length += static_cast<RawPropsPropNameLength>(nameLength);

  // Suffix
  if (suffix) {
    auto suffixLength = std::strlen(suffix);
    std::memcpy(buffer + *length, suffix, suffixLength);
    *length += static_cast<RawPropsPropNameLength>(suffixLength);
  }
  assert(*length < kPropNameLengthHardCap);
}

RawPropsKey::operator std::string() const noexcept {
  char buffer[kPropNameLengthHardCap];
  RawPropsPropNameLength length = 0;
  render(buffer, &length);
  assert(length < kPropNameLengthHardCap);
  return std::string{buffer, length};
}

bool operator==(RawPropsKey const &lhs, RawPropsKey const &rhs) noexcept {
  // Note: We check the name first.
  return lhs.name == rhs.name && lhs.prefix == rhs.prefix &&
      lhs.suffix == rhs.suffix;
}

bool operator!=(RawPropsKey const &lhs, RawPropsKey const &rhs) noexcept {
  return !(lhs == rhs);
}

} // namespace react
} // namespace facebook
