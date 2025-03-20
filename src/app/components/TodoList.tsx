'use client';

import { useState } from 'react';
import { Todo } from '../types/todo';

type TodoListProps = {
  initialTodos: Todo[];
};

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, newTodo]);
    setNewTodoTitle('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TODO一覧</h1>
      
      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="新しいTODOを入力"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            追加
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center p-4 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className="w-5 h-5 mr-3 cursor-pointer"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 