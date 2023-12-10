const fs = require('fs');
const path = require('path');
const findWorkspaceRoot = require('find-yarn-workspace-root');
const {pathsToModuleNameMapper} = require('ts-jest');

const workspaceRoot = findWorkspaceRoot(__dirname);

const configNameByType = {
  jest: 'jest.config.js',
  babel: 'babel.config.js',
  eslint: '.eslintrc.js',
  lintStaged: 'lint-staged.config.js',
};
const configsRoot = module.path;

/**
 * Find the most relevant config files for a platform.
 */
function configsByPlatform(platform) {
  const commonRoot = path.resolve(configsRoot, 'base');
  let platformRoot = path.resolve(configsRoot, platform);
  const configs = {};
  for (const configType of Object.keys(configNameByType)) {
    const configName = configNameByType[configType];
    let configPath = path.resolve(platformRoot, configName);
    if (!fs.existsSync(configPath)) {
      configPath = path.resolve(commonRoot, configName);
    }
    if (fs.existsSync(configPath)) {
      configs[configType] = require(configPath);
    }
  }
  return configs;
}

function hasAnyDependency(pkg, name) {
  for (const key of ['dependencies', 'peerDependencies', 'devDependencies']) {
    if (pkg[key] && pkg[key][name]) {
      return true;
    }
  }
  return false;
}

function guessModulePlatform(pkg) {
  if (hasAnyDependency(pkg, 'react-native')) {
    return 'react-native';
  } else if (hasAnyDependency(pkg, 'react')) {
    return 'react';
  } else {
    return 'common';
  }
}

function guessModuleType(mod) {
  const basename = path.basename(mod.path);
  return basename.split('-')[0];
}

/**
 * Discover information specific to a Node module.
 *
 * - The contents of `package.json`
 * - The "platform" (node, React, React Native) the module is most designed for
 * - The module "kind" (hook, ui, etc.)
 */
function moduleInfo(mod) {
  const pkg = require(path.resolve(mod.path, 'package.json'));
  const platform = guessModulePlatform(pkg);
  const type = guessModuleType(mod);

  const setupFilesAfterEnv = [];
  // Add the first Jest setup file we find.
  for (const setupPath of [
    path.resolve(mod.path, '.jest', 'setup.ts'),
    path.resolve(mod.path, 'jest', 'setup.js'),
  ]) {
    if (fs.existsSync(setupPath)) {
      setupFilesAfterEnv.push(setupPath);
      break;
    }
  }

  const setupFiles = [];
  // Setup react-native-gesture-handler mocks
  // https://docs.swmansion.com/react-native-gesture-handler/docs/1.10.3/#testing
  if (hasAnyDependency(pkg, 'react-native-gesture-handler')) {
    setupFiles.push(
      path.resolve(workspaceRoot, 'node_modules/react-native-gesture-handler/jestSetup.js'),
    );
  }
  // Setup @shopify/flash-list mocks
  // https://shopify.github.io/flash-list/docs/testing
  if (hasAnyDependency(pkg, '@shopify/flash-list')) {
    setupFiles.push(path.resolve(workspaceRoot, 'node_modules/@shopify/flash-list/jestSetup.js'));
  }

  if (hasAnyDependency(pkg, '@testing-library/react-native')) {
    setupFilesAfterEnv.push(path.resolve(__dirname, 'base', '.jest', 'jest-native-setup.ts'));
  }

  if (hasAnyDependency(pkg, '@testing-library/react-hooks')) {
    setupFilesAfterEnv.push(
      path.resolve(__dirname, 'base', '.jest', 'jest-extended-setup.ts'),
      'jest-extended/all',
    );
  }

  return {
    pkg,
    platform,
    type,
    base: configsByPlatform(platform),
    setupFiles,
    setupFilesAfterEnv,
  };
}

/**
 * Generate a Jest config.
 */
function jestConfig(mod, config) {
  const {pkg, base, platform, type, setupFiles, setupFilesAfterEnv} = moduleInfo(mod);
  const preset = {
    'react-native': 'react-native',
  }[platform];
  const color =
    {
      hooks: 'magenta',
      ui: 'cyan',
    }[type] ?? 'white';
  const {compilerOptions} = require(path.resolve(mod.path, 'tsconfig.json'));
  const moduleNameMapper = compilerOptions.paths
    ? pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'})
    : undefined;

  return {
    ...base.jest,
    preset,
    ...config,
    displayName: {
      name: pkg.name,
      color,
    },
    moduleNameMapper: {
      ...moduleNameMapper,
      '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    },
    transform: {
      // NOTE: This pattern needs to match the pattern from the React Native
      // Jest preset exactly, otherwise it won't be overridden and the Babel
      // options won't be passed.
      // https://github.com/facebook/react-native/blob/main/jest-preset.js
      '^.+\\.(js|ts|tsx)$': [
        'babel-jest',
        {
          cwd: mod.path,
          rootMode: 'upward',
        },
      ],
      '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    },
    roots: [
      // This is the workspace project being tested.
      '<rootDir>',
      // This will find `shared/__mocks__`.
      path.resolve(workspaceRoot, 'shared'),
    ],
    setupFiles: [...(base.setupFiles ?? []), ...setupFiles, ...(config?.setupFiles ?? [])],
    setupFilesAfterEnv: [
      ...(base.setupFilesAfterEnv ?? []),
      ...setupFilesAfterEnv,
      ...(config?.setupFilesAfterEnv ?? []),
    ],
  };
}

/**
 * Generate a Babel config.
 */
function babelConfig(mod, config) {
  const {base} = moduleInfo(mod);
  const finalConfig = {
    ...base.babel,
    ...config,
  };
  delete finalConfig.babelrcRoots;
  return finalConfig;
}

/**
 * Generate an ESLint config.
 */
function eslintConfig(mod, config) {
  const {base} = moduleInfo(mod);
  return {
    ...base.eslint,
    ...config,
    overrides: [...(base.eslint.overrides ?? []), ...(config?.overrides ?? [])],
    rules: {
      ...base.eslint.rules,
      ...config?.rules,
    },
  };
}

/**
 * Generate a Lint Staged config
 */
function lintStagedConfig(mod, config) {
  const {base} = moduleInfo(mod);

  return {
    ...base.lintStaged,
    ...config,
  };
}

module.exports = {
  jest: jestConfig,
  babel: babelConfig,
  eslint: eslintConfig,
  lintStaged: lintStagedConfig,
};
