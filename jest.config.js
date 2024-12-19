module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-junit",
  preset: 'ts-jest', // Stick with ts-jest for TypeScript (optional, based on your project setup)
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['D:/frontend/hostel-project-webUI/src/setupTests.js'], // Ensure this path is correct
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // This should be sufficient
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Handle CSS imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Handle image imports
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
};