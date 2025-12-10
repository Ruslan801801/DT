module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
testMatch: ['**/?(*.)+(spec|test).ts'],
moduleFileExtensions: ['ts','js','json'],
roots: ['<rootDir>/server/test'],
globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } }
};