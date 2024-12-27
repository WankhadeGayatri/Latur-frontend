module.exports = {
  rootDir: ".",
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-junit",
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
    moduleNameMapper: {
    "^@/config/(.*)$": "<rootDir>/config/$1",  // This will correctly map to /config folder
    "^@/(.*)$": "<rootDir>/app/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/mocks/fileMock.js"
    }
  ,
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'jest-junit.xml',
      classNameTemplate: "{classname}",
      titleTemplate: "{title}",
      ancestorSeparator: " › ",
      usePathForSuiteName: true
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'test-results/test-report.html',
      theme: 'lightTheme',
      styleOverridePath: './test-results/custom-styles.css',
      includeFailureMsg: true,
      includeConsoleLog: true,
      executionTime: true,
    }]
  ]
};
