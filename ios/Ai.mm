#import "Ai.h"
#import "MLCEngine.h"

@interface Ai ()

@property (nonatomic, strong) MLCEngine *engine;
@property (nonatomic, strong) NSURL *bundleURL;
@property (nonatomic, strong) NSString *modelPath;
@property (nonatomic, strong) NSString *modelLib;
@property (nonatomic, strong) NSString *displayText;

@end

@implementation Ai

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _engine = [[MLCEngine alloc] init];
        _bundleURL = [[[NSBundle mainBundle] bundleURL] URLByAppendingPathComponent:@"bundle"];
        _modelPath = @"Llama-3-8B-Instruct-q3f16_1-MLC";
        _modelLib = @"llama_q3f16_1";
        _displayText = @"";
    }
    return self;
}

RCT_EXPORT_METHOD(doGenerate:(NSString *)instanceId
                  text:(NSString *)text
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Generating for instance ID: %@, with text: %@", instanceId, text);
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSURL *modelLocalURL = [self.bundleURL URLByAppendingPathComponent:self.modelPath];
        NSString *modelLocalPath = [modelLocalURL path];
        
        [self.engine reloadWithModelPath:modelLocalPath modelLib:self.modelLib];
        
        NSDictionary *message = @{
            @"role": @"user",
            @"content": text
        };
        
        [self.engine chatCompletionWithMessages:@[message] completion:^(id response) {
            if ([response isKindOfClass:[NSDictionary class]]) {
                NSDictionary *responseDictionary = (NSDictionary *)response;
                if (responseDictionary[@"usage"]) {
                    NSString *usageText = [self getUsageTextFromExtra:responseDictionary[@"usage"][@"extra"]];
                    self.displayText = [self.displayText stringByAppendingFormat:@"\n%@", usageText];
                    resolve(self.displayText);
                } else {
                    NSString *content = responseDictionary[@"choices"][0][@"delta"][@"content"];
                    if (content) {
                        self.displayText = [self.displayText stringByAppendingString:content];
                    }
                }
            } else if ([response isKindOfClass:[NSString class]]) {
                self.displayText = [self.displayText stringByAppendingString:(NSString *)response];
            }
        }];
    });
}

RCT_EXPORT_METHOD(doStream:(NSString *)instanceId
                  text:(NSString *)text
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Streaming for instance ID: %@, with text: %@", instanceId, text);
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSURL *modelLocalURL = [self.bundleURL URLByAppendingPathComponent:self.modelPath];
        NSString *modelLocalPath = [modelLocalURL path];
        
        [self.engine reloadWithModelPath:modelLocalPath modelLib:self.modelLib];
        
        NSDictionary *message = @{
            @"role": @"user",
            @"content": text
        };
        
        [self.engine chatCompletionWithMessages:@[message] completion:^(id response) {
            if ([response isKindOfClass:[NSDictionary class]]) {
                NSDictionary *responseDictionary = (NSDictionary *)response;
                if (responseDictionary[@"usage"]) {
                    NSString *usageText = [self getUsageTextFromExtra:responseDictionary[@"usage"][@"extra"]];
                    self.displayText = [self.displayText stringByAppendingFormat:@"\n%@", usageText];
                    resolve(self.displayText);
                } else {
                    NSString *content = responseDictionary[@"choices"][0][@"delta"][@"content"];
                    if (content) {
                        self.displayText = [self.displayText stringByAppendingString:content];
//                        [self sendEventWithName:@"onStreamProgress" body:@{@"text": content}];
                    }
                }
            } else if ([response isKindOfClass:[NSString class]]) {
                NSString *content = (NSString *)response;
                self.displayText = [self.displayText stringByAppendingString:content];
//                [self sendEventWithName:@"onStreamProgress" body:@{@"text": content}];
            }
        }];
    });
}


RCT_EXPORT_METHOD(getModel:(NSString *)name
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Getting model: %@", name);
    
    // For now, we're just returning the model path and lib
    NSDictionary *modelInfo = @{
        @"path": self.modelPath,
        @"lib": self.modelLib
    };
    
    resolve(modelInfo);
}

- (NSString *)getUsageTextFromExtra:(NSDictionary *)extra {
    // Implement this method to convert the extra dictionary to a string
    // This is a placeholder implementation
    return [extra description];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onStreamProgress"];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAiSpecJSI>(params);
}
#endif

@end
