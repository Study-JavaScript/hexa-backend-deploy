module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^repositories/(.*)$': '<rootDir>/repositories/$1',
      '^usecases/(.*)$': '<rootDir>/usecases/$1',
      '^domain/(.*)$': '<rootDir>/domain/$1',
    },
    roots: ['<rootDir>/test'], // Asegúrate de que Jest busque en esta carpeta
  };
  