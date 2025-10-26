process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise during testing
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
};
