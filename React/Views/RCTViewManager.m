/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTViewManager.h"

#import "RCTBorderStyle.h"
#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"
#import "RCTShadowView.h"
#import "RCTUIManager.h"
#import "RCTUIManagerUtils.h"
#import "RCTUtils.h"
#import "RCTView.h"
#import "UIView+React.h"
#import "RCTConvert+Transform.h"

#if TARGET_OS_TV
#import "RCTTVView.h"
#endif

#if !TARGET_OS_OSX // TODO(macOS ISS#2323203)
@implementation RCTConvert(UIAccessibilityTraits)

RCT_MULTI_ENUM_CONVERTER(UIAccessibilityTraits, (@{
  @"none": @(UIAccessibilityTraitNone),
  @"button": @(UIAccessibilityTraitButton),
  @"link": @(UIAccessibilityTraitLink),
  @"header": @(UIAccessibilityTraitHeader),
  @"search": @(UIAccessibilityTraitSearchField),
  @"image": @(UIAccessibilityTraitImage),
  @"imagebutton": @(UIAccessibilityTraitImage | UIAccessibilityTraitButton),
  @"selected": @(UIAccessibilityTraitSelected),
  @"plays": @(UIAccessibilityTraitPlaysSound),
  @"key": @(UIAccessibilityTraitKeyboardKey),
  @"keyboardkey": @(UIAccessibilityTraitKeyboardKey),
  @"text": @(UIAccessibilityTraitStaticText),
  @"summary": @(UIAccessibilityTraitSummaryElement),
  @"disabled": @(UIAccessibilityTraitNotEnabled),
  @"frequentUpdates": @(UIAccessibilityTraitUpdatesFrequently),
  @"startsMedia": @(UIAccessibilityTraitStartsMediaSession),
  @"adjustable": @(UIAccessibilityTraitAdjustable),
  @"allowsDirectInteraction": @(UIAccessibilityTraitAllowsDirectInteraction),
  @"pageTurn": @(UIAccessibilityTraitCausesPageTurn),
  // TODO(macOS ISS#2323203):
  // a set of RN accessibilityTraits are macOS specific accessiblity roles and map to nothing on iOS:
  @"group": @(UIAccessibilityTraitNone),
  @"list": @(UIAccessibilityTraitNone),
  // TODO(macOS ISS#2323203)
}), UIAccessibilityTraitNone, unsignedLongLongValue)

@end
#endif // TODO(macOS ISS#2323203)

@implementation RCTViewManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return RCTGetUIManagerQueue();
}

- (RCTPlatformView *)view // TODO(macOS ISS#2323203)
{
#if TARGET_OS_TV
  return [RCTTVView new];
#else
  return [RCTView new];
#endif
}

- (RCTShadowView *)shadowView
{
  return [RCTShadowView new];
}

- (NSArray<NSString *> *)customBubblingEventTypes
{
  return @[

    // Generic events
    @"press",
    @"change",
    @"focus",
    @"blur",
    @"submitEditing",
    @"endEditing",
    @"keyPress",

    // Touch events
    @"touchStart",
    @"touchMove",
    @"touchCancel",
    @"touchEnd",
  ];
}

#pragma mark - View properties

#if TARGET_OS_TV
// Apple TV properties
RCT_EXPORT_VIEW_PROPERTY(isTVSelectable, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hasTVPreferredFocus, BOOL)
RCT_EXPORT_VIEW_PROPERTY(tvParallaxProperties, NSDictionary)
#endif

RCT_EXPORT_VIEW_PROPERTY(nativeID, NSString)

// Acessibility related properties
#if !TARGET_OS_OSX
RCT_REMAP_VIEW_PROPERTY(accessible, reactAccessibilityElement.isAccessibilityElement, BOOL)
#else // [TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(accessible, reactAccessibilityElement.accessibilityElement, BOOL)
#endif // ]TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(accessibilityActions, reactAccessibilityElement.accessibilityActions, NSArray<NSString *>)
RCT_REMAP_VIEW_PROPERTY(accessibilityLabel, reactAccessibilityElement.accessibilityLabel, NSString)
#if !TARGET_OS_OSX // TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(accessibilityHint, reactAccessibilityElement.accessibilityHint, NSString) // TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(accessibilityTraits, reactAccessibilityElement.accessibilityTraits, UIAccessibilityTraits)
RCT_REMAP_VIEW_PROPERTY(accessibilityViewIsModal, reactAccessibilityElement.accessibilityViewIsModal, BOOL)
RCT_REMAP_VIEW_PROPERTY(accessibilityElementsHidden, reactAccessibilityElement.accessibilityElementsHidden, BOOL)
RCT_REMAP_VIEW_PROPERTY(accessibilityIgnoresInvertColors, reactAccessibilityElement.shouldAccessibilityIgnoresInvertColors, BOOL)
RCT_REMAP_VIEW_PROPERTY(onAccessibilityAction, reactAccessibilityElement.onAccessibilityAction, RCTDirectEventBlock)
#else // [TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(accessibilityHint, reactAccessibilityElement.accessibilityHelp, NSString)
#endif // ]TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(onAccessibilityTap, reactAccessibilityElement.onAccessibilityTap, RCTDirectEventBlock)
#if !TARGET_OS_OSX // TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(onMagicTap, reactAccessibilityElement.onMagicTap, RCTDirectEventBlock)
#else // [TODO(macOS ISS#2323203)
RCT_CUSTOM_VIEW_PROPERTY(accessibilityTraits, NSString, RCTView)
{
  if (json) {
    view.accessibilityRole = [RCTConvert accessibilityRoleFromTraits:json];
  } else {
    view.accessibilityRole = defaultView.accessibilityRole;
  }
}
#endif // ]TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(onAccessibilityEscape, reactAccessibilityElement.onAccessibilityEscape, RCTDirectEventBlock)
RCT_REMAP_VIEW_PROPERTY(testID, reactAccessibilityElement.accessibilityIdentifier, NSString)

RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_REMAP_VIEW_PROPERTY(backfaceVisibility, layer.doubleSided, css_backface_visibility_t)
#if !TARGET_OS_OSX // TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(opacity, alpha, CGFloat)
#else // [TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(opacity, alphaValue, CGFloat)
#endif // ]TODO(macOS ISS#2323203)
RCT_REMAP_VIEW_PROPERTY(shadowColor, layer.shadowColor, CGColor)
RCT_REMAP_VIEW_PROPERTY(shadowOffset, layer.shadowOffset, CGSize)
RCT_REMAP_VIEW_PROPERTY(shadowOpacity, layer.shadowOpacity, float)
RCT_REMAP_VIEW_PROPERTY(shadowRadius, layer.shadowRadius, CGFloat)
RCT_CUSTOM_VIEW_PROPERTY(overflow, YGOverflow, RCTView)
{
  if (json) {
    view.clipsToBounds = [RCTConvert YGOverflow:json] != YGOverflowVisible;
  } else {
    view.clipsToBounds = defaultView.clipsToBounds;
  }
}
#if !TARGET_OS_OSX // [TODO(macOS ISS#2323203)
RCT_CUSTOM_VIEW_PROPERTY(shouldRasterizeIOS, BOOL, RCTView)
{
  view.layer.shouldRasterize = json ? [RCTConvert BOOL:json] : defaultView.layer.shouldRasterize;
  view.layer.rasterizationScale = view.layer.shouldRasterize ? [UIScreen mainScreen].scale : defaultView.layer.rasterizationScale;
}
#endif // ]TODO(macOS ISS#2323203)

RCT_CUSTOM_VIEW_PROPERTY(transform, CATransform3D, RCTView)
{
#if !TARGET_OS_OSX // [TODO(macOS ISS#2323203)
  view.layer.transform = json ? [RCTConvert CATransform3D:json] : defaultView.layer.transform;
  // TODO: Improve this by enabling edge antialiasing only for transforms with rotation or skewing
  view.layer.allowsEdgeAntialiasing = !CATransform3DIsIdentity(view.layer.transform);
#elif TARGET_OS_OSX // TODO(macOS ISS#2323203)
  view.layer.sublayerTransform = json ? [RCTConvert CATransform3D:json] : defaultView.layer.sublayerTransform;
  // TODO: Improve this by enabling edge antialiasing only for transforms with rotation or skewing
  view.layer.edgeAntialiasingMask = !CATransform3DIsIdentity(view.layer.sublayerTransform) ? kCALayerLeftEdge | kCALayerRightEdge | kCALayerBottomEdge | kCALayerTopEdge : 0;
#endif // ]TODO(macOS ISS#2323203)
}

RCT_CUSTOM_VIEW_PROPERTY(accessibilityRole, UIAccessibilityTraits, RCTView)
{
#if !TARGET_OS_OSX
  // This mask must be kept in sync with the AccessibilityRoles enum defined in ViewAccessibility.js and DeprecatedViewAccessibility.js
  const UIAccessibilityTraits AccessibilityRolesMask = UIAccessibilityTraitNone | UIAccessibilityTraitButton | UIAccessibilityTraitLink | UIAccessibilityTraitSearchField | UIAccessibilityTraitImage | UIAccessibilityTraitKeyboardKey | UIAccessibilityTraitStaticText | UIAccessibilityTraitAdjustable | UIAccessibilityTraitHeader | UIAccessibilityTraitSummaryElement;

  UIAccessibilityTraits newTraits = json ? [RCTConvert UIAccessibilityTraits:json] : defaultView.accessibilityTraits;
  UIAccessibilityTraits maskedTraits = newTraits & AccessibilityRolesMask;

  view.reactAccessibilityElement.accessibilityTraits = (view.reactAccessibilityElement.accessibilityTraits & ~AccessibilityRolesMask) | maskedTraits;
#else
  if (json) {
    view.reactAccessibilityElement.accessibilityRole = [RCTConvert accessibilityRoleFromTraits:json];
  } else {
    view.reactAccessibilityElement.accessibilityRole = defaultView.accessibilityRole;
  }
#endif
}

RCT_CUSTOM_VIEW_PROPERTY(accessibilityStates, UIAccessibilityTraits, RCTView)
{
#if !TARGET_OS_OSX
  // This mask must be kept in sync with the AccessibilityStates enum defined in ViewAccessibility.js and DeprecatedViewAccessibility.js
  const UIAccessibilityTraits AccessibilityStatesMask = UIAccessibilityTraitNotEnabled | UIAccessibilityTraitSelected;

  UIAccessibilityTraits newTraits = json ? [RCTConvert UIAccessibilityTraits:json] : defaultView.accessibilityTraits;
  UIAccessibilityTraits maskedTraits = newTraits & AccessibilityStatesMask;
  view.reactAccessibilityElement.accessibilityTraits = (view.reactAccessibilityElement.accessibilityTraits & ~AccessibilityStatesMask) | maskedTraits;
#else
#endif
}

RCT_CUSTOM_VIEW_PROPERTY(pointerEvents, RCTPointerEvents, RCTView)
{
  if ([view respondsToSelector:@selector(setPointerEvents:)]) {
    view.pointerEvents = json ? [RCTConvert RCTPointerEvents:json] : defaultView.pointerEvents;
    return;
  }

  if (!json) {
    view.userInteractionEnabled = defaultView.userInteractionEnabled;
    return;
  }

  switch ([RCTConvert RCTPointerEvents:json]) {
    case RCTPointerEventsUnspecified:
      // Pointer events "unspecified" acts as if a stylesheet had not specified,
      // which is different than "auto" in CSS (which cannot and will not be
      // supported in `React`. "auto" may override a parent's "none".
      // Unspecified values do not.
      // This wouldn't override a container view's `userInteractionEnabled = NO`
      view.userInteractionEnabled = YES;
    case RCTPointerEventsNone:
      view.userInteractionEnabled = NO;
      break;
    default:
      RCTLogError(@"UIView base class does not support pointerEvent value: %@", json);
  }
}
RCT_CUSTOM_VIEW_PROPERTY(removeClippedSubviews, BOOL, RCTView)
{
  if ([view respondsToSelector:@selector(setRemoveClippedSubviews:)]) {
    view.removeClippedSubviews = json ? [RCTConvert BOOL:json] : defaultView.removeClippedSubviews;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(borderRadius, CGFloat, RCTView) {
  if ([view respondsToSelector:@selector(setBorderRadius:)]) {
    view.borderRadius = json ? [RCTConvert CGFloat:json] : defaultView.borderRadius;
  } else {
    view.layer.cornerRadius = json ? [RCTConvert CGFloat:json] : defaultView.layer.cornerRadius;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(borderColor, CGColor, RCTView)
{
  if ([view respondsToSelector:@selector(setBorderColor:)]) {
    view.borderColor = json ? [RCTConvert CGColor:json] : defaultView.borderColor;
  } else {
    view.layer.borderColor = json ? [RCTConvert CGColor:json] : defaultView.layer.borderColor;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(borderWidth, float, RCTView)
{
  if ([view respondsToSelector:@selector(setBorderWidth:)]) {
    view.borderWidth = json ? [RCTConvert CGFloat:json] : defaultView.borderWidth;
  } else {
    view.layer.borderWidth = json ? [RCTConvert CGFloat:json] : defaultView.layer.borderWidth;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(borderStyle, RCTBorderStyle, RCTView)
{
  if ([view respondsToSelector:@selector(setBorderStyle:)]) {
    view.borderStyle = json ? [RCTConvert RCTBorderStyle:json] : defaultView.borderStyle;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(hitSlop, UIEdgeInsets, RCTView)
{
  if ([view respondsToSelector:@selector(setHitTestEdgeInsets:)]) {
    if (json) {
      UIEdgeInsets hitSlopInsets = [RCTConvert UIEdgeInsets:json];
      view.hitTestEdgeInsets = UIEdgeInsetsMake(-hitSlopInsets.top, -hitSlopInsets.left, -hitSlopInsets.bottom, -hitSlopInsets.right);
    } else {
      view.hitTestEdgeInsets = defaultView.hitTestEdgeInsets;
    }
  }
}

#if TARGET_OS_OSX // [TODO(macOS ISS#2323203)
// macOS properties
RCT_CUSTOM_VIEW_PROPERTY(acceptsKeyboardFocus, BOOL, RCTView)
{
  if ([view respondsToSelector:@selector(setAcceptsKeyboardFocus:)]) {
    view.acceptsKeyboardFocus = json ? [RCTConvert BOOL:json] : defaultView.acceptsKeyboardFocus;
  }
}
RCT_CUSTOM_VIEW_PROPERTY(enableFocusRing, BOOL, RCTView)
{
  if ([view respondsToSelector:@selector(setEnableFocusRing:)]) {
    view.enableFocusRing = json ? [RCTConvert BOOL:json] : defaultView.enableFocusRing;
  }
}

RCT_REMAP_VIEW_PROPERTY(tooltip, toolTip, NSString)

RCT_CUSTOM_VIEW_PROPERTY(draggedTypes, NSArray<NSPasteboardType>*, RCTView)
{
  NSArray<NSPasteboardType> *currentTypes = view.registeredDraggedTypes;
  NSArray<NSPasteboardType> *types = json ? [RCTConvert NSPasteboardTypeArray:json] : defaultView.registeredDraggedTypes;
  if (![currentTypes isEqualToArray:types]) {
    [view unregisterDraggedTypes];
  }
  [view registerForDraggedTypes:types];
}

#endif // ]TODO(macOS ISS#2323203)

#define RCT_VIEW_BORDER_PROPERTY(SIDE)                                  \
RCT_CUSTOM_VIEW_PROPERTY(border##SIDE##Width, float, RCTView)           \
{                                                                       \
  if ([view respondsToSelector:@selector(setBorder##SIDE##Width:)]) {   \
    view.border##SIDE##Width = json ? [RCTConvert CGFloat:json] : defaultView.border##SIDE##Width; \
  }                                                                     \
}                                                                       \
RCT_CUSTOM_VIEW_PROPERTY(border##SIDE##Color, UIColor, RCTView)         \
{                                                                       \
  if ([view respondsToSelector:@selector(setBorder##SIDE##Color:)]) {   \
    view.border##SIDE##Color = json ? [RCTConvert CGColor:json] : defaultView.border##SIDE##Color; \
  }                                                                     \
}

RCT_VIEW_BORDER_PROPERTY(Top)
RCT_VIEW_BORDER_PROPERTY(Right)
RCT_VIEW_BORDER_PROPERTY(Bottom)
RCT_VIEW_BORDER_PROPERTY(Left)
RCT_VIEW_BORDER_PROPERTY(Start)
RCT_VIEW_BORDER_PROPERTY(End)

#define RCT_VIEW_BORDER_RADIUS_PROPERTY(SIDE)                           \
RCT_CUSTOM_VIEW_PROPERTY(border##SIDE##Radius, CGFloat, RCTView)        \
{                                                                       \
  if ([view respondsToSelector:@selector(setBorder##SIDE##Radius:)]) {  \
    view.border##SIDE##Radius = json ? [RCTConvert CGFloat:json] : defaultView.border##SIDE##Radius; \
  }                                                                     \
}                                                                       \

RCT_VIEW_BORDER_RADIUS_PROPERTY(TopLeft)
RCT_VIEW_BORDER_RADIUS_PROPERTY(TopRight)
RCT_VIEW_BORDER_RADIUS_PROPERTY(TopStart)
RCT_VIEW_BORDER_RADIUS_PROPERTY(TopEnd)
RCT_VIEW_BORDER_RADIUS_PROPERTY(BottomLeft)
RCT_VIEW_BORDER_RADIUS_PROPERTY(BottomRight)
RCT_VIEW_BORDER_RADIUS_PROPERTY(BottomStart)
RCT_VIEW_BORDER_RADIUS_PROPERTY(BottomEnd)

RCT_REMAP_VIEW_PROPERTY(display, reactDisplay, YGDisplay)
RCT_REMAP_VIEW_PROPERTY(zIndex, reactZIndex, NSInteger)

// [TODO(OSS Candidate ISS#2710739)
RCT_EXPORT_VIEW_PROPERTY(onFocus, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBlur, RCTBubblingEventBlock)
// ]TODO(OSS Candidate ISS#2710739)


#if TARGET_OS_OSX // TODO(macOS ISS#2323203)
#pragma mark - macOS properties

RCT_EXPORT_VIEW_PROPERTY(onDoubleClick, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onClick, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMouseEnter, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMouseLeave, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDragEnter, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDragLeave, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDrop, RCTDirectEventBlock)
#endif // TODO(macOS ISS#2323203)

#pragma mark - ShadowView properties

RCT_EXPORT_SHADOW_PROPERTY(top, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(right, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(start, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(end, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(bottom, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(left, YGValue)

RCT_EXPORT_SHADOW_PROPERTY(width, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(height, YGValue)

RCT_EXPORT_SHADOW_PROPERTY(minWidth, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(maxWidth, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(minHeight, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(maxHeight, YGValue)

RCT_EXPORT_SHADOW_PROPERTY(borderTopWidth, float)
RCT_EXPORT_SHADOW_PROPERTY(borderRightWidth, float)
RCT_EXPORT_SHADOW_PROPERTY(borderBottomWidth, float)
RCT_EXPORT_SHADOW_PROPERTY(borderLeftWidth, float)
RCT_EXPORT_SHADOW_PROPERTY(borderStartWidth, float)
RCT_EXPORT_SHADOW_PROPERTY(borderEndWidth, float)
RCT_EXPORT_SHADOW_PROPERTY(borderWidth, float)

RCT_EXPORT_SHADOW_PROPERTY(marginTop, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginRight, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginBottom, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginLeft, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginStart, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginEnd, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginVertical, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(marginHorizontal, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(margin, YGValue)

RCT_EXPORT_SHADOW_PROPERTY(paddingTop, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingRight, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingBottom, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingLeft, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingStart, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingEnd, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingVertical, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(paddingHorizontal, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(padding, YGValue)

RCT_EXPORT_SHADOW_PROPERTY(flex, float)
RCT_EXPORT_SHADOW_PROPERTY(flexGrow, float)
RCT_EXPORT_SHADOW_PROPERTY(flexShrink, float)
RCT_EXPORT_SHADOW_PROPERTY(flexBasis, YGValue)
RCT_EXPORT_SHADOW_PROPERTY(flexDirection, YGFlexDirection)
RCT_EXPORT_SHADOW_PROPERTY(flexWrap, YGWrap)
RCT_EXPORT_SHADOW_PROPERTY(justifyContent, YGJustify)
RCT_EXPORT_SHADOW_PROPERTY(alignItems, YGAlign)
RCT_EXPORT_SHADOW_PROPERTY(alignSelf, YGAlign)
RCT_EXPORT_SHADOW_PROPERTY(alignContent, YGAlign)
RCT_EXPORT_SHADOW_PROPERTY(position, YGPositionType)
RCT_EXPORT_SHADOW_PROPERTY(aspectRatio, float)

RCT_EXPORT_SHADOW_PROPERTY(overflow, YGOverflow)
RCT_EXPORT_SHADOW_PROPERTY(display, YGDisplay)

RCT_EXPORT_SHADOW_PROPERTY(onLayout, RCTDirectEventBlock)

RCT_EXPORT_SHADOW_PROPERTY(direction, YGDirection)

@end
