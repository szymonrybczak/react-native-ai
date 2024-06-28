
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAiSpec.h"

@interface Ai : NSObject <NativeAiSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Ai : NSObject <RCTBridgeModule>
#endif

@end
