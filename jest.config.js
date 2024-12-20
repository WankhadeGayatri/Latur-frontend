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
      includeFailureMsg: true,
      includeConsoleLog: true,
      customCss: `
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 20px;
        }

        h1, h2, h3 {
          color: #333;
          text-align: center;
        }

        .test-suite {
          margin: 20px auto;
          max-width: 800px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .test-case {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .test-case:last-child {
          border-bottom: none;
        }

        .passed {
          color: green;
        }

        .failed {
          color: red;
        }

        .pending {
          color: orange;
        }
      `,
    }],
  ],
};
