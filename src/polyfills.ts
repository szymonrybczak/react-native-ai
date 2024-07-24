// @ts-ignore
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

const webStreamPolyfills = require('web-streams-polyfill/ponyfill/es6');

polyfillGlobal('TextEncoder', () => require('text-encoding').TextEncoder);
polyfillGlobal('TextDecoder', () => require('text-encoding').TextDecoder);
polyfillGlobal('ReadableStream', () => webStreamPolyfills.ReadableStream);
polyfillGlobal('TransformStream', () => webStreamPolyfills.TransformStream);
