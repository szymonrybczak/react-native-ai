import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getModel(name: string): Promise<string>; // Returns JSON string of ModelInstance
  doGenerate(instanceId: string, text: string): Promise<string>;
  doStream(instanceId: string, text: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Ai');
