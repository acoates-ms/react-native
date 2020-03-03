/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

#import <Cocoa/Cocoa.h>

@class RCTBridge;

@interface AppDelegate : NSObject <NSApplicationDelegate>

@property (nonatomic, readonly) RCTBridge *bridge;

@end