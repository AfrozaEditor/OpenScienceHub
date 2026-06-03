const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { resolver: { sourceExts, assetExts } } = getDefaultConfig(__dirname);

const credoLiteModulePath = path.resolve(__dirname, 'shims/credo-core-lite/defaultModules.mjs');
const credoLiteEmptyPath = path.resolve(__dirname, 'shims/credo-core-lite/empty.mjs');
const credoLiteCorePath = path.resolve(__dirname, 'shims/credo-core-lite/core.mjs');
const credoCoreBuildPath = `${path.sep}node_modules${path.sep}@credo-ts${path.sep}core${path.sep}build${path.sep}`;
const credoCoreAgentPath = `${path.sep}node_modules${path.sep}@credo-ts${path.sep}core${path.sep}build${path.sep}agent${path.sep}`;
const credoDependencyPathPattern = `${path.sep}node_modules${path.sep}@credo-ts${path.sep}`;
const didcommBuildPath = `${path.sep}node_modules${path.sep}@credo-ts${path.sep}didcomm${path.sep}build${path.sep}`;

const credoLiteDefaultModules = new Set([
  '../modules/vc/W3cCredentialsModule.mjs',
  '../modules/vc/W3cCredentialsApi.mjs',
  '../modules/vc/W3cV2CredentialsApi.mjs',
  '../modules/mdoc/MdocModule.mjs',
  '../modules/mdoc/MdocApi.mjs',
  '../modules/sd-jwt-vc/SdJwtVcModule.mjs',
  '../modules/sd-jwt-vc/SdJwtVcApi.mjs',
  '../modules/x509/X509Module.mjs',
  '../modules/x509/X509Api.mjs',
  '../modules/dcql/DcqlModule.mjs',
  '../modules/dif-presentation-exchange/DifPresentationExchangeModule.mjs',
]);

const credoLiteEmptyModules = new Set([
  '../modules/vc/index.mjs',
  '../modules/mdoc/index.mjs',
  '../modules/sd-jwt-vc/index.mjs',
  '../modules/x509/index.mjs',
  '../modules/dif-presentation-exchange/index.mjs',
  '../modules/dcql/index.mjs',
]);

const optionalCoreModulePattern = /^(\.\/|\.\.\/)modules\/(vc|mdoc|sd-jwt-vc|dcql|dif-presentation-exchange|x509)\//;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg', 'js', 'json', 'ts', 'tsx', 'cjs'], 
    extraNodeModules: {
      'expo-crypto': path.resolve(__dirname, 'shims/expo-crypto'),
    },
    resolveRequest(context, moduleName, platform) {
      if (context.originModulePath.includes(didcommBuildPath) && moduleName === './modules/index.mjs') {
        return { type: 'sourceFile', filePath: credoLiteEmptyPath };
      }

      if (
        moduleName === '@credo-ts/core' &&
        context.originModulePath.includes(credoDependencyPathPattern) &&
        !context.originModulePath.includes(credoCoreBuildPath)
      ) {
        return { type: 'sourceFile', filePath: credoLiteCorePath };
      }

      if (context.originModulePath.includes(credoCoreBuildPath) && optionalCoreModulePattern.test(moduleName)) {
        if (moduleName.endsWith('/index.mjs')) {
          return { type: 'sourceFile', filePath: credoLiteEmptyPath };
        }

        return { type: 'sourceFile', filePath: credoLiteModulePath };
      }

      if (context.originModulePath.includes(credoCoreAgentPath)) {
        if (credoLiteDefaultModules.has(moduleName)) {
          return { type: 'sourceFile', filePath: credoLiteModulePath };
        }

        if (credoLiteEmptyModules.has(moduleName)) {
          return { type: 'sourceFile', filePath: credoLiteEmptyPath };
        }
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
