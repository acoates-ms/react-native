/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// TODO(macOS ISS#2323203) TODO(windows ISS): this file is TouchableNativeFeedback.ios.js in facebook's repo.  Renamed to TouchableNativeFeedback.js since it is shared here between ios, macos, and windows.

'use strict';

const React = require('React');
const StyleSheet = require('StyleSheet');
const Text = require('Text');
const View = require('View');

class DummyTouchableNativeFeedback extends React.Component {
  static SelectableBackground = () => ({});
  static SelectableBackgroundBorderless = () => ({});
  static Ripple = () => ({});
  static canUseNativeForeground = () => false;

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={styles.info}>
          TouchableNativeFeedback is not supported on this platform!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 300,
    backgroundColor: '#ffbcbc',
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  info: {
    color: '#333333',
    margin: 20,
  },
});

module.exports = DummyTouchableNativeFeedback;
