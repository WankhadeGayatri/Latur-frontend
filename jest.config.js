module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-junit",
  preset: 'ts-jest', // Stick with ts-jest for TypeScript (optional, based on your project setup)
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Ensure this path is correct
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest for TypeScript files
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // This should be sufficient
  },
  moduleNameMapper: {
    '^@/(.)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Handle CSS imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/mocks/fileMock.js', // Handle image imports
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/.{js,jsx,ts,tsx}',
    '!src/*/.d.ts',
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
    }]
  ]
};
