const libDir = process.env.LIB_DIR;

const transformIgnorePatterns = [
  '/dist/',
  'node_modules\/[^/]+?\/(?!(es|node_modules)\/)', // Ignore modules without es dir
];

module.exports = {
  setupFiles: [
    './tests/setup.js'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'md',
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  transform: {
    '\\.tsx?$': './node_modules/ap-tool/lib/jest/codePreprocessor',
    '\\.js$': './node_modules/ap-tool/lib/jest/codePreprocessor'
  },
  testRegex: libDir === 'dist' ? 'demo\\.spec\\.js$' : '.*\\.spec\\.js$',
  // 覆盖率
  collectCoverage: true,
  coverageFormats: ["json", "html"],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/**/*.native.{ts,tsx}',
    '!src/components/*/style/*.{ts,tsx}',
  ],
  transformIgnorePatterns,
  testEnvironment: 'jsdom',
  // 替换文件，把样式文件替换成mock
  moduleNameMapper: { "\\.(css|less)$": "<rootDir>/tests/mock/styleMock.js" }
};
