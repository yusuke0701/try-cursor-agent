'use client';

import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import CelebrationDialog from './CelebrationDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

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
      
      <CelebrationDialog isOpen={showCelebration} />

      <TodoForm
        title={newTodoTitle}
        dueDate={newTodoDueDate}
        onTitleChange={setNewTodoTitle}
        onDueDateChange={setNewTodoDueDate}
        onSubmit={handleAddTodo}
      />

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
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteClick}
            formatDate={formatDate}
            isOverdue={isOverdue}
          />
        ))}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteConfirmId}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
} 