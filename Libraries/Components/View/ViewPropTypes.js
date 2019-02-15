/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const React = require('React');
const EdgeInsetsPropType = require('EdgeInsetsPropType');
const PlatformViewPropTypes = require('PlatformViewPropTypes');
const PropTypes = require('prop-types');
const StyleSheetPropType = require('StyleSheetPropType');
const ViewStylePropTypes = require('ViewStylePropTypes');

const {
  AccessibilityComponentTypes,
  AccessibilityTraits,
  AccessibilityNodeInfoPropType, // TODO(android ISS)
  AccessibilityRoles,
  AccessibilityStates,
} = require('ViewAccessibility');

import type {
  AccessibilityComponentType,
  AccessibilityTrait,
  AccessibilityNodeInfoProp, // TODO(android ISS)
  AccessibilityRole,
  AccessibilityState,
} from 'ViewAccessibility';
import type {EdgeInsetsProp} from 'EdgeInsetsPropType';
import type {TVViewProps} from 'TVViewPropTypes';
import type {Layout, LayoutEvent} from 'CoreEventTypes';

const stylePropType = StyleSheetPropType(ViewStylePropTypes);

const DraggedTypes = [ // [TODO(macOS ISS#2323203)
  'fileUrl',
]; // ]TODO(macOS ISS#2323203)

export type ViewLayout = Layout;
export type ViewLayoutEvent = LayoutEvent;

type DirectEventProps = $ReadOnly<{|
  onAccessibilityAction?: Function,
  onAccessibilityTap?: Function,
  onDoubleClick?: ?Function, // TODO(macOS ISS#2323203)
  onKeyDown?: ?Function, // TODO(macOS ISS#2323203)
  onLayout?: ?(event: LayoutEvent) => void,
  onMagicTap?: Function,
|}>;

type TouchEventProps = $ReadOnly<{|
  onTouchCancel?: ?Function,
  onTouchCancelCapture?: ?Function,
  onTouchEnd?: ?Function,
  onTouchEndCapture?: ?Function,
  onTouchMove?: ?Function,
  onTouchMoveCapture?: ?Function,
  onTouchStart?: ?Function,
  onTouchStartCapture?: ?Function,
|}>;

type GestureResponderEventProps = $ReadOnly<{|
  onMoveShouldSetResponder?: ?Function,
  onMoveShouldSetResponderCapture?: ?Function,
  onResponderGrant?: ?Function,
  onResponderMove?: ?Function,
  onResponderReject?: ?Function,
  onResponderRelease?: ?Function,
  onResponderStart?: ?Function,
  onResponderTerminate?: ?Function,
  onResponderTerminationRequest?: ?Function,
  onStartShouldSetResponder?: ?Function,
  onStartShouldSetResponderCapture?: ?Function,
|}>;

type AndroidViewProps = $ReadOnly<{|
  nativeBackgroundAndroid?: ?Object,
  nativeForegroundAndroid?: ?Object,

  /* Deprecated transform prop. Use the transform style prop instead */
  rotation?: empty,
  /* Deprecated transform prop. Use the transform style prop instead */
  scaleX?: empty,
  /* Deprecated transform prop. Use the transform style prop instead */
  scaleY?: empty,
  /* Deprecated transform prop. Use the transform style prop instead */
  translateX?: empty,
  /* Deprecated transform prop. Use the transform style prop instead */
  translateY?: empty,
|}>;

export type ViewProps = $ReadOnly<{|
  ...DirectEventProps,
  ...GestureResponderEventProps,
  ...TouchEventProps,
  ...AndroidViewProps,

  // There's no easy way to create a different type if (Platform.isTV):
  // so we must include TVViewProps
  ...TVViewProps,

  accessible?: boolean,
  accessibilityLabel?:
    | null
    | React$PropType$Primitive<any>
    | string
    | Array<any>
    | any,
  accessibilityHint?: string,
  accessibilityActions?: Array<string>,
  accessibilityComponentType?: AccessibilityComponentType,
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive',
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants',
  accessibilityIgnoresInvertColors?: boolean,
  accessibilityTraits?: AccessibilityTrait | Array<AccessibilityTrait>,
  accessibilityRole?: AccessibilityRole,
  accessibilityStates?: Array<AccessibilityState>,
  accessibilityViewIsModal?: boolean,
  accessibilityElementsHidden?: boolean,
  children?: ?React.Node,
  testID?: ?string,
  nativeID?: string,
  onDoubleClick?: ?Function, // TODO(macOS ISS#2323203)
  onKeyDown?: ?Function, // TODO(macOS ISS#2323203)
  hitSlop?: ?EdgeInsetsProp,
  pointerEvents?: null | 'box-none' | 'none' | 'box-only' | 'auto',
  style?: stylePropType,
  removeClippedSubviews?: boolean,
  renderToHardwareTextureAndroid?: boolean,
  shouldRasterizeIOS?: boolean,
  collapsable?: boolean,
  needsOffscreenAlphaCompositing?: boolean,
  clickable?: bool, // [TODO(android ISS)
  onClick ?: Function,
  onFocusChange?: Function, // ]TODO(android ISS)
  onMouseEnter: Function, // [TODO(macOS ISS#2323203)
  onMouseLeave: Function,
  onDragEnter: Function,
  onDragLeave: Function,
  onDrop: Function,
  onFocus?: Function,
  onBlur?: Function,
  acceptsKeyboardFocus?: bool,
  enableFocusRing?: bool,
  tooltip?: string,
  draggedTypes: DraggedTypes | Array<DraggedTypes>, // ]TODO(macOS ISS#2323203)
  accessibilityNodeInfo?: AccessibilityNodeInfoProp, // TODO(android ISS)
|}>;

module.exports = {
  /**
   * When `true`, indicates that the view is an accessibility element.
   * By default, all the touchable elements are accessible.
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessible
   */
  accessible: PropTypes.bool,

  /**
   * Overrides the text that's read by the screen reader when the user interacts
   * with the element. By default, the label is constructed by traversing all
   * the children and accumulating all the `Text` nodes separated by space.
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilitylabel
   */
  accessibilityLabel: PropTypes.node,

  /**
   * An accessibility hint helps users understand what will happen when they perform
   * an action on the accessibility element when that result is not obvious from the
   * accessibility label.
   *
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilityHint
   */
  accessibilityHint: PropTypes.string,

  /**
   * Provides an array of custom actions available for accessibility.
   *
   * @platform ios
   */
  accessibilityActions: PropTypes.arrayOf(PropTypes.string),

  /**
   * Sets the hint text that's read by the screen reader when the user interacts
   * with the element.
   */
  accessibilityHint: PropTypes.node, // TODO(OSS Candidate ISS#2710739)

  /**
   * Prevents view from being inverted if set to true and color inversion is turned on.
   *
   * @platform ios
   */
  accessibilityIgnoresInvertColors: PropTypes.bool,

  /**
   * Indicates to accessibility services to treat UI component like a
   * native one. Works for Android only.
   *
   * @platform android
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilitycomponenttype
   */
  accessibilityComponentType: PropTypes.oneOf(AccessibilityComponentTypes),

  /**
   * Indicates to accessibility services to treat UI component like a specific role.
   */
  accessibilityRole: PropTypes.oneOf(AccessibilityRoles),

  /**
   * Indicates to accessibility services that UI Component is in a specific State.
   */
  accessibilityStates: PropTypes.arrayOf(PropTypes.oneOf(AccessibilityStates)),
  /**
   * Indicates to accessibility services whether the user should be notified
   * when this view changes. Works for Android API >= 19 only.
   *
   * @platform android
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilityliveregion
   */
  accessibilityLiveRegion: PropTypes.oneOf(['none', 'polite', 'assertive']),

  /**
   * Controls how view is important for accessibility which is if it
   * fires accessibility events and if it is reported to accessibility services
   * that query the screen. Works for Android only.
   *
   * @platform android
   *
   * See http://facebook.github.io/react-native/docs/view.html#importantforaccessibility
   */
  importantForAccessibility: PropTypes.oneOf([
    'auto',
    'yes',
    'no',
    'no-hide-descendants',
  ]),

  /**
   * Provides privilege to overrides accessibilityNodeInfo properties to be delivered to accessibility 
   * service. Works for Android only.
   * 
   * Currently supported properties:
   *  - clickable : bool
   * 
   * See the [Android `AccessibilityNodeInfo` docs](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.html)
   * for reference.
   * 
   * @platform android
   */
  accessibilityNodeInfo: AccessibilityNodeInfoPropType, // TODO(android ISS)

  /**
   * Provides additional traits to screen reader. By default no traits are
   * provided unless specified otherwise in element.
   *
   * You can provide one trait or an array of many traits.
   *
   * @platform ios
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilitytraits
   */
  accessibilityTraits: PropTypes.oneOfType([
    PropTypes.oneOf(AccessibilityTraits),
    PropTypes.arrayOf(PropTypes.oneOf(AccessibilityTraits)),
  ]),

  /**
   * A value indicating whether VoiceOver should ignore the elements
   * within views that are siblings of the receiver.
   * Default is `false`.
   *
   * @platform ios
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilityviewismodal
   */
  accessibilityViewIsModal: PropTypes.bool,

  /**
   * A value indicating whether the accessibility elements contained within
   * this accessibility element are hidden.
   *
   * @platform ios
   *
   * See http://facebook.github.io/react-native/docs/view.html#accessibilityElementsHidden
   */
  accessibilityElementsHidden: PropTypes.bool,

  /**
   * When `accessible` is true, the system will try to invoke this function
   * when the user performs an accessibility custom action.
   *
   * @platform ios
   */
  onAccessibilityAction: PropTypes.func,
  
  onDoubleClick: PropTypes.func, // TODO(macOS ISS#2323203)

  /**
   * When `accessible` is true, the system will try to invoke this function
   * when the user performs accessibility tap gesture.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onaccessibilitytap
   */
  onAccessibilityTap: PropTypes.func,

  /**
   * When `accessible` is `true`, the system will invoke this function when the
   * user performs the magic tap gesture.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onmagictap
   */
  onMagicTap: PropTypes.func,

  /**
   * Used to locate this view in end-to-end tests.
   *
   * > This disables the 'layout-only view removal' optimization for this view!
   *
   * See http://facebook.github.io/react-native/docs/view.html#testid
   */
  testID: PropTypes.string,

  /**
   * Used to locate this view from native classes.
   *
   * > This disables the 'layout-only view removal' optimization for this view!
   *
   * See http://facebook.github.io/react-native/docs/view.html#nativeid
   */
  nativeID: PropTypes.string,

  /**
   * For most touch interactions, you'll simply want to wrap your component in
   * `TouchableHighlight` or `TouchableOpacity`. Check out `Touchable.js`,
   * `ScrollResponder.js` and `ResponderEventPlugin.js` for more discussion.
   */

  /**
   * The View is now responding for touch events. This is the time to highlight
   * and show the user what is happening.
   *
   * `View.props.onResponderGrant: (event) => {}`, where `event` is a synthetic
   * touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onrespondergrant
   */
  onResponderGrant: PropTypes.func,

  /**
   * The user is moving their finger.
   *
   * `View.props.onResponderMove: (event) => {}`, where `event` is a synthetic
   * touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onrespondermove
   */
  onResponderMove: PropTypes.func,

  /**
   * Another responder is already active and will not release it to that `View`
   * asking to be the responder.
   *
   * `View.props.onResponderReject: (event) => {}`, where `event` is a
   * synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onresponderreject
   */
  onResponderReject: PropTypes.func,

  /**
   * Fired at the end of the touch.
   *
   * `View.props.onResponderRelease: (event) => {}`, where `event` is a
   * synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onresponderrelease
   */
  onResponderRelease: PropTypes.func,

  /**
   * The responder has been taken from the `View`. Might be taken by other
   * views after a call to `onResponderTerminationRequest`, or might be taken
   * by the OS without asking (e.g., happens with control center/ notification
   * center on iOS)
   *
   * `View.props.onResponderTerminate: (event) => {}`, where `event` is a
   * synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onresponderterminate
   */
  onResponderTerminate: PropTypes.func,

  /**
   * Some other `View` wants to become responder and is asking this `View` to
   * release its responder. Returning `true` allows its release.
   *
   * `View.props.onResponderTerminationRequest: (event) => {}`, where `event`
   * is a synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onresponderterminationrequest
   */
  onResponderTerminationRequest: PropTypes.func,

  /**
   * Does this view want to become responder on the start of a touch?
   *
   * `View.props.onStartShouldSetResponder: (event) => [true | false]`, where
   * `event` is a synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onstartshouldsetresponder
   */
  onStartShouldSetResponder: PropTypes.func,

  /**
   * If a parent `View` wants to prevent a child `View` from becoming responder
   * on a touch start, it should have this handler which returns `true`.
   *
   * `View.props.onStartShouldSetResponderCapture: (event) => [true | false]`,
   * where `event` is a synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onstartshouldsetrespondercapture
   */
  onStartShouldSetResponderCapture: PropTypes.func,

  /**
   * Does this view want to "claim" touch responsiveness? This is called for
   * every touch move on the `View` when it is not the responder.
   *
   * `View.props.onMoveShouldSetResponder: (event) => [true | false]`, where
   * `event` is a synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onmoveshouldsetresponder
   */
  onMoveShouldSetResponder: PropTypes.func,

  /**
   * If a parent `View` wants to prevent a child `View` from becoming responder
   * on a move, it should have this handler which returns `true`.
   *
   * `View.props.onMoveShouldSetResponderCapture: (event) => [true | false]`,
   * where `event` is a synthetic touch event as described above.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onMoveShouldsetrespondercapture
   */
  onMoveShouldSetResponderCapture: PropTypes.func,

  /**
   * This defines how far a touch event can start away from the view.
   * Typical interface guidelines recommend touch targets that are at least
   * 30 - 40 points/density-independent pixels.
   *
   * > The touch area never extends past the parent view bounds and the Z-index
   * > of sibling views always takes precedence if a touch hits two overlapping
   * > views.
   *
   * See http://facebook.github.io/react-native/docs/view.html#hitslop
   */
  hitSlop: EdgeInsetsPropType,

  /**
   * Invoked on mount and layout changes with:
   *
   * `{nativeEvent: { layout: {x, y, width, height}}}`
   *
   * This event is fired immediately once the layout has been calculated, but
   * the new layout may not yet be reflected on the screen at the time the
   * event is received, especially if a layout animation is in progress.
   *
   * See http://facebook.github.io/react-native/docs/view.html#onlayout
   */
  onLayout: PropTypes.func,

  /**
   * Controls whether the `View` can be the target of touch events.
   *
   * See http://facebook.github.io/react-native/docs/view.html#pointerevents
   */
  pointerEvents: PropTypes.oneOf(['box-none', 'none', 'box-only', 'auto']),

  /**
   * See http://facebook.github.io/react-native/docs/style.html
   */
  style: stylePropType,

  /**
   * This is a special performance property exposed by `RCTView` and is useful
   * for scrolling content when there are many subviews, most of which are
   * offscreen. For this property to be effective, it must be applied to a
   * view that contains many subviews that extend outside its bound. The
   * subviews must also have `overflow: hidden`, as should the containing view
   * (or one of its superviews).
   *
   * See http://facebook.github.io/react-native/docs/view.html#removeclippedsubviews
   */
  removeClippedSubviews: PropTypes.bool,

  /**
   * Whether this `View` should render itself (and all of its children) into a
   * single hardware texture on the GPU.
   *
   * @platform android
   *
   * See http://facebook.github.io/react-native/docs/view.html#rendertohardwaretextureandroid
   */
  renderToHardwareTextureAndroid: PropTypes.bool,

  /**
   * Whether this `View` should be rendered as a bitmap before compositing.
   *
   * @platform ios
   *
   * See http://facebook.github.io/react-native/docs/view.html#shouldrasterizeios
   */
  shouldRasterizeIOS: PropTypes.bool,

  /**
   * Views that are only used to layout their children or otherwise don't draw
   * anything may be automatically removed from the native hierarchy as an
   * optimization. Set this property to `false` to disable this optimization and
   * ensure that this `View` exists in the native view hierarchy.
   *
   * @platform android
   *
   * See http://facebook.github.io/react-native/docs/view.html#collapsable
   */
  collapsable: PropTypes.bool,

  /**
   * Whether this `View` needs to rendered offscreen and composited with an
   * alpha in order to preserve 100% correct colors and blending behavior.
   *
   * @platform android
   *
   * See http://facebook.github.io/react-native/docs/view.html#needsoffscreenalphacompositing
   */
  needsOffscreenAlphaCompositing: PropTypes.bool,

  /**
   * When `true`, indicates that the view is clickable. By default,
   * all the touchable elements are clickable.
   * 
   * @platform android
   */
  clickable: PropTypes.bool, // TODO(android ISS)
  
  /**
   * When `clickable` is true, the system will try to invoke this function
   * when the user performs a click.
   * 
   * @platform android
   */
  onClick: PropTypes.func, // TODO(android ISS)

  /**
   * Fired when a pointing device is moved over the view
   * 
   * @platform macos
   */
  onMouseEnter: PropTypes.func, // TODO(macOS ISS#2323203)
  
  /**
   * Fired when a pointing device is moved out the view
   * 
   * @platform macos
   */
  onMouseLeave: PropTypes.func, // TODO(macOS ISS#2323203)
  
  /**
   * Fired when a dragged element enters a valid drop target
   * 
   * @platform macos
   */
  onDragEnter: PropTypes.func, // TODO(macOS ISS#2323203)
  
  /**
   * Fired when a dragged element leaves a valid drop target
   * 
   * @platform macos
   */
  onDragLeave: PropTypes.func, // TODO(macOS ISS#2323203)

  /**
   * Fired when an element is dropped on a valid drop target
   * 
   * @platform macos
   */
  onDrop: PropTypes.func, // TODO(macOS ISS#2323203)
  
  /**
  * Specifies the Tooltip for the view
  * @platform macos
  */
  tooltip: PropTypes.string, // TODO(macOS ISS#2323203)

  /**
  * Specifies whether the view participates in the key view loop as user tabs
  * through different controls.
  */
  acceptsKeyboardFocus: PropTypes.bool, // TODO(macOS ISS#2323203)

  /**
  * Specifies whether focus ring should be drawn when the view has the first responder status.
  */
  enableFocusRing: PropTypes.bool, // TODO(macOS ISS#2323203)

  /**
   * fired when the view focus changes (gain->lose or lose->gain)
   * 
   * @platform android
   */
  onFocusChange: PropTypes.func, // TODO(android ISS)

  /**
   * Fired when an element is focused
   *
   * @platform macos
   * @platform ios
   */
  onFocus: PropTypes.func, // TODO(macOS ISS#2323203)

  /**
   * Fired when an element loses focus
   *
   * @platform macos
   * @platform ios
   */
  onBlur: PropTypes.func, // TODO(macOS ISS#2323203)

  /**
   * Enables Dran'n'Drop Support for certain types of dragged types
   *
   * Possible values for `draggedTypes` are:
   * 
   * - `'fileUrl'`
   * 
   * @platform macos
   */
  draggedTypes: PropTypes.oneOfType([ // TODO(macOS ISS#2323203)
    PropTypes.oneOf(DraggedTypes),
    PropTypes.arrayOf(PropTypes.oneOf(DraggedTypes)),
  ]),

  /**
   * Any additional platform-specific view prop types, or prop type overrides.
   */
  ...PlatformViewPropTypes,
};
