import '@testing-library/jest-dom';

// localStorageのモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
};
global.localStorage = localStorageMock as unknown as Storage;

// Notification APIのモック
const NotificationMock = {
  permission: 'default' as NotificationPermission,
  requestPermission: jest.fn(),
};
global.Notification = NotificationMock as unknown as typeof Notification; 