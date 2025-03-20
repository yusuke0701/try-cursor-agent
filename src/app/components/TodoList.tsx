'use client';

import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

const STORAGE_KEY = 'todos';
const NOTIFICATION_PERMISSION_KEY = 'notificationPermission';

type TodoListProps = {
  initialTodos: Todo[];
};

type StoredTodo = Omit<Todo, 'createdAt' | 'completedAt' | 'dueDate'> & {
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
};

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showCelebration, setShowCelebration] = useState(false);

  // 通知の許可を確認
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.log('このブラウザは通知をサポートしていません');
        return;
      }

      const permission = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
      if (permission) {
        setNotificationPermission(permission as NotificationPermission);
        return;
      }

      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, result);
    };

    checkNotificationPermission();
  }, []);

  // 期限切れのTODOをチェック
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const checkDueDates = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (!todo.completedAt && todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          if (dueDate < now) {
            // 期限切れの通知を送信
            new Notification('TODO期限切れ', {
              body: `「${todo.title}」の期限が切れています`,
              icon: '/favicon.ico'
            });
          }
        }
      });
    };

    // 1分ごとにチェック
    const interval = setInterval(checkDueDates, 60000);
    checkDueDates(); // 初回チェック

    return () => clearInterval(interval);
  }, [todos, notificationPermission]);

  // 初期データの読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos) as StoredTodo[];
        // Date型に変換し、無効な日付をフィルタリング
        const todosWithDates = parsedTodos
          .map((todo) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
          }))
          .filter((todo) => !isNaN(todo.createdAt.getTime()));
        setTodos(todosWithDates);
      } catch (error) {
        console.error('Failed to load todos:', error);
        setTodos([]);
      }
    }
  }, []);

  // データの保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }, [todos]);

  // 全てのTODOが完了したかチェック
  useEffect(() => {
    if (todos.length > 0 && todos.every(todo => todo.completedAt)) {
      setShowCelebration(true);
      // 3秒後にメッセージを非表示
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      createdAt: new Date(),
      dueDate: newTodoDueDate ? new Date(newTodoDueDate) : undefined
    };

    setTodos([newTodo, ...todos]); // 新しいTODOを配列の先頭に追加
    setNewTodoTitle('');
    setNewTodoDueDate('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? {
        ...todo,
        completedAt: todo.completedAt ? undefined : new Date()
      } : todo
    ));
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    setTodos(todos.filter(todo => todo.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  // 作成日時でソート（新しい順）
  const sortedTodos = [...todos]
    .filter(todo => showCompleted || !todo.completedAt)
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 期限切れかどうかを判定する関数
  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date() > dueDate;
  };

  // 完了済みTODOの数をカウント
  const completedCount = todos.filter(todo => todo.completedAt).length;
  const totalCount = todos.length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">TODO一覧</h1>
      
      {/* お祝いメッセージ */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center animate-bounce">
            <div className="text-6xl mb-4 animate-spin">🎉</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">おめでとうございます！</h2>
            <p className="text-gray-700">全てのTODOを完了しました！</p>
            <div className="mt-4 text-sm text-gray-500">
              素晴らしい仕事をしました！
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="新しいTODOを入力"
                className="w-full px-5 py-3 text-base border-2 border-gray-200 rounded-lg 
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  placeholder:text-gray-400 placeholder:text-base
                  text-gray-900 bg-white
                  transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                font-medium text-base transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newTodoTitle.trim()}
            >
              追加
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dueDate" className="text-sm text-gray-600">
              期限:
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              className="px-3 py-2 text-base border-2 border-gray-200 rounded-lg 
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                text-gray-900 bg-white
                transition-colors duration-200"
            />
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          完了済み: {completedCount}/{totalCount}
        </div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg
            transition-colors duration-200"
        >
          {showCompleted ? '完了済みを非表示' : '完了済みを表示'}
        </button>
      </div>

      <div className="space-y-3">
        {sortedTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200
              ${!todo.completedAt && todo.dueDate && isOverdue(todo.dueDate) ? 'border-2 border-red-500' : ''}`}
          >
            <input
              type="checkbox"
              checked={!!todo.completedAt}
              onChange={() => handleToggleTodo(todo.id)}
              className="w-5 h-5 mr-3 cursor-pointer accent-blue-500"
            />
            <div className="flex-1">
              <span className={`block text-base leading-relaxed ${todo.completedAt ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.title}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                <span>作成: {formatDate(todo.createdAt)}</span>
                {todo.completedAt && (
                  <span className="ml-2">完了: {formatDate(todo.completedAt)}</span>
                )}
                {todo.dueDate && (
                  <span className={`ml-2 ${!todo.completedAt && isOverdue(todo.dueDate) ? 'text-red-500' : ''}`}>
                    期限: {formatDate(todo.dueDate)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDeleteClick(todo.id)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none font-medium"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {/* 削除確認ダイアログ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">確認</h2>
            <p className="mb-6 text-gray-700">本当に削除しますか？</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 