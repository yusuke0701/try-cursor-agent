import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../TodoList';
import { Theme } from '../../types/theme';

// モックの設定
const mockTheme: Theme = 'light';

// localStorageのモック
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Notification APIのモック
const mockNotification = {
  requestPermission: jest.fn(),
  permission: 'default' as NotificationPermission,
};
Object.defineProperty(window, 'Notification', { value: mockNotification });

describe('TodoList', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    mockLocalStorage.clear.mockImplementation(() => {});
    mockNotification.requestPermission.mockResolvedValue('granted');
  });

  it('renders todo list with initial empty state', () => {
    render(<TodoList theme={mockTheme} />);
    
    expect(screen.getByText('TODO一覧')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('新しいTODOを入力')).toBeInTheDocument();
    expect(screen.getByText('完了済みを表示')).toBeInTheDocument();
  });

  it('adds a new todo', async () => {
    render(<TodoList theme={mockTheme} />);
    
    const input = screen.getByPlaceholderText('新しいTODOを入力');
    const submitButton = screen.getByText('追加');

    await userEvent.type(input, '新しいTODO');
    await userEvent.click(submitButton);

    expect(screen.getByText('新しいTODO')).toBeInTheDocument();
  });

  it('toggles todo completion', async () => {
    render(<TodoList theme={mockTheme} />);
    
    // 新しいTodoを追加
    const input = screen.getByPlaceholderText('新しいTODOを入力');
    const submitButton = screen.getByText('追加');
    await userEvent.type(input, 'テストTODO');
    await userEvent.click(submitButton);

    // チェックボックスをクリック
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    // 完了状態が変更されたことを確認
    expect(checkbox).toBeChecked();
  });

  it('deletes a todo', async () => {
    render(<TodoList theme={mockTheme} />);
    
    // 新しいTodoを追加
    const input = screen.getByPlaceholderText('新しいTODOを入力');
    const submitButton = screen.getByText('追加');
    await userEvent.type(input, 'テストTODO');
    await userEvent.click(submitButton);

    // 削除ボタンをクリック（SVGアイコンを含むボタン）
    const deleteButton = screen.getByRole('button', { name: '' });
    await userEvent.click(deleteButton);

    // 確認ダイアログで削除をクリック
    const confirmButton = screen.getByText('削除');
    await userEvent.click(confirmButton);

    // Todoが削除されたことを確認
    expect(screen.queryByText('テストTODO')).not.toBeInTheDocument();
  });

  it('filters todos correctly', async () => {
    render(<TodoList theme={mockTheme} />);
    
    // 複数のTodoを追加
    const input = screen.getByPlaceholderText('新しいTODOを入力');
    const submitButton = screen.getByText('追加');
    
    await userEvent.type(input, '完了TODO');
    await userEvent.click(submitButton);

    await userEvent.type(input, '未完了TODO');
    await userEvent.click(submitButton);

    // 完了TODOを完了状態にする
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);

    // 完了済みを表示ボタンをクリック
    const showCompletedButton = screen.getByText('完了済みを表示');
    await userEvent.click(showCompletedButton);

    // 完了済みTODOと未完了TODOが表示されることを確認
    expect(screen.getByText('完了TODO')).toBeInTheDocument();
    expect(screen.getByText('未完了TODO')).toBeInTheDocument();

    // 完了済みを非表示ボタンをクリック
    await userEvent.click(showCompletedButton);

    // 未完了TODOのみが表示されることを確認
    expect(screen.queryByText('完了TODO')).not.toBeInTheDocument();
    expect(screen.getByText('未完了TODO')).toBeInTheDocument();
  });

  it('requests notification permission when clicking the notification button', async () => {
    render(<TodoList theme={mockTheme} />);
    
    const notificationButton = screen.getByText('通知を許可する');
    await userEvent.click(notificationButton);

    expect(global.Notification.requestPermission).toHaveBeenCalled();
  });
}); 