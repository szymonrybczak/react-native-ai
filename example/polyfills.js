// @ts-ignore
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

polyfillGlobal('TextEncoder', () => require('text-encoding').TextEncoder);
polyfillGlobal('TextDecoder', () => require('text-encoding').TextDecoder);
