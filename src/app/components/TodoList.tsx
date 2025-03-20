'use client';

import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { Theme, themePresets } from '../types/theme';
import CelebrationDialog from './CelebrationDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

interface TodoListProps {
  theme: Theme;
}

type StoredTodo = Omit<Todo, 'createdAt' | 'completedAt' | 'dueDate'> & {
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
};

export default function TodoList({ theme }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 通知の許可を確認
  useEffect(() => {
    if (isClient && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [isClient]);

  // 通知の許可を要求
  const requestNotificationPermission = async () => {
    if (isClient && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // 期限切れのTODOをチェックして通知
  useEffect(() => {
    if (isClient && notificationPermission === 'granted') {
      const checkOverdueTodos = () => {
        todos.forEach((todo) => {
          if (todo.dueDate && !todo.completedAt && isOverdue(todo.dueDate)) {
            new Notification('期限切れのTODOがあります', {
              body: `「${todo.title}」の期限が切れています`,
              icon: '/favicon.ico',
            });
          }
        });
      };

      const interval = setInterval(checkOverdueTodos, 60000); // 1分ごとにチェック
      return () => clearInterval(interval);
    }
  }, [todos, notificationPermission, isClient]);

  // すべてのTODOが完了したかチェック
  useEffect(() => {
    if (todos.length > 0 && todos.every((todo) => todo.completedAt)) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [todos]);

  // ローカルストレージからTODOを読み込む
  useEffect(() => {
    if (isClient) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsedTodos: StoredTodo[] = JSON.parse(savedTodos);
        const convertedTodos: Todo[] = parsedTodos.map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(convertedTodos);
      }
    }
  }, [isClient]);

  // TODOをローカルストレージに保存
  useEffect(() => {
    if (isClient) {
      const todosToSave = todos.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt.toISOString(),
        completedAt: todo.completedAt?.toISOString(),
        dueDate: todo.dueDate?.toISOString(),
      }));
      localStorage.setItem('todos', JSON.stringify(todosToSave));
    }
  }, [todos, isClient]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      createdAt: new Date(),
      dueDate: newTodoDueDate ? new Date(newTodoDueDate) : undefined,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodoTitle('');
    setNewTodoDueDate('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completedAt: todo.completedAt ? undefined : new Date(),
            }
          : todo
      )
    );
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    const now = new Date();
    return dueDate < now;
  };

  // 完了済みTODOの表示/非表示を切り替え
  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  // 完了済みTODOの数を計算
  const completedCount = todos.filter((todo) => todo.completedAt).length;

  // フィルター適用済みのTODOリストを作成
  const filteredTodos = showCompleted
    ? todos
    : todos.filter((todo) => !todo.completedAt);

  // 作成日時でソート
  const sortedTodos = [...filteredTodos].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // 通知の許可を要求するボタンを表示
  const renderNotificationButton = () => {
    if (!isClient || !('Notification' in window)) return null;
    if (notificationPermission === 'granted') return null;

    return (
      <button
        onClick={requestNotificationPermission}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${themePresets[theme].submitButton}`}
      >
        通知を許可する
      </button>
    );
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${themePresets[theme].page}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${themePresets[theme].heading}`}>TODO一覧</h1>
        {renderNotificationButton()}
      </div>
      
      <CelebrationDialog isOpen={showCelebration} />

      <TodoForm
        title={newTodoTitle}
        dueDate={newTodoDueDate}
        onTitleChange={setNewTodoTitle}
        onDueDateChange={setNewTodoDueDate}
        onSubmit={handleAddTodo}
        theme={theme}
      />

      <div className="flex items-center justify-between mb-4">
        <div className={`text-sm ${themePresets[theme].filterText}`}>
          完了済み: {completedCount}/{todos.length}
        </div>
        <button
          onClick={toggleShowCompleted}
          className={`px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg transition-colors duration-200 ${themePresets[theme].filterButton}`}
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
            onDelete={() => handleDeleteClick(todo.id)}
            formatDate={formatDate}
            isOverdue={isOverdue}
            theme={theme}
          />
        ))}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteConfirmId}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        theme={theme}
      />
    </div>
  );
} 