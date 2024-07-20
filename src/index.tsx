import { NativeModules, Platform } from 'react-native';
import type {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1FinishReason,
  LanguageModelV1FunctionToolCall,
} from '@ai-sdk/provider';
import './polyfills';

const LINKING_ERROR =
  `The package 'react-native-ai' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const AiModule = isTurboModuleEnabled
  ? require('./NativeAi').default
  : NativeModules.Ai;

const Ai = AiModule
  ? AiModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export async function getModel(name: string): Promise<AiModel> {
  // const instanceDataJson = await Ai.getModel(name);
  // console.log(instanceDataJson);
  // const instanceData: ModelInstance = JSON.parse(instanceDataJson);
  // return new AiModel(instanceData);
}

export interface ModelInstance {
  instanceId: string;
  modelId: string;
  modelLib: string;
  // Add other properties here as needed
}

class AiModel implements LanguageModelV1 {
  private instanceId: string;
  public modelId: string;
  public modelLib: string;

  constructor(instanceData: ModelInstance) {
    this.instanceId = instanceData.instanceId;
    this.modelId = instanceData.modelId;
    this.modelLib = instanceData.modelLib;
  }

  async doGenerate(options: LanguageModelV1CallOptions): Promise<{
    text?: string;
    toolCalls?: Array<LanguageModelV1FunctionToolCall>;
    finishReason: LanguageModelV1FinishReason;
    usage: {
      promptTokens: number;
      completionTokens: number;
    };
    rawCall: {
      rawPrompt: unknown;
      rawSettings: Record<string, unknown>;
    };
  }> {
    console.log({
      role: options.prompt[0]?.role,
      message: options.prompt[0]?.content[0]?.text,
    });

    // fix role issue, and implement streaming function and we'll be fine!
    const text = await Ai.doGenerate(
      this.instanceId,
      options.prompt[0]?.content[0]?.text
    );

    console.log(JSON.stringify(text));

    return {
      text,
      finishReason: 'stop',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
      },
      rawCall: {
        rawPrompt: options,
        rawSettings: {},
      },
    };
  }

  async doStream(text: string): Promise<void> {
    return Ai.doStream(this.instanceId, text);
  }
}
const { doGenerate, doStream } = Ai;

export { doGenerate, doStream };
