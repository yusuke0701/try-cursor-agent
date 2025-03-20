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

  // 通知の許可を確認
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // 通知の許可を要求
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // 期限切れのTODOをチェックして通知
  useEffect(() => {
    if (notificationPermission === 'granted') {
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
  }, [todos, notificationPermission]);

  // すべてのTODOが完了したかチェック
  useEffect(() => {
    if (todos.length > 0 && todos.every((todo) => todo.completedAt)) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [todos]);

  // ローカルストレージからTODOを読み込む
  useEffect(() => {
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
  }, []);

  // TODOをローカルストレージに保存
  useEffect(() => {
    const todosToSave = todos.map((todo) => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      completedAt: todo.completedAt?.toISOString(),
      dueDate: todo.dueDate?.toISOString(),
    }));
    localStorage.setItem('todos', JSON.stringify(todosToSave));
  }, [todos]);

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

  const completedCount = todos.filter((todo) => todo.completedAt).length;
  const totalCount = todos.length;

  const sortedTodos = todos
    .filter((todo) => showCompleted || !todo.completedAt)
    .sort((a, b) => {
      if (a.completedAt && b.completedAt) {
        return b.completedAt.getTime() - a.completedAt.getTime();
      }
      if (a.completedAt) return 1;
      if (b.completedAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  // 通知の許可を要求するボタンを表示
  const renderNotificationButton = () => {
    if (!('Notification' in window)) return null;
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
          完了済み: {completedCount}/{totalCount}
        </div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
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
            onDelete={handleDeleteClick}
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