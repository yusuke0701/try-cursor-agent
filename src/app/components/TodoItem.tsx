import { Todo } from '../types/todo';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: Date) => string;
  isOverdue: (dueDate?: Date) => boolean;
};

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  formatDate,
  isOverdue,
}: TodoItemProps) {
  return (
    <div
      className={`flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200
        ${!todo.completedAt && todo.dueDate && isOverdue(todo.dueDate) ? 'border-2 border-red-500' : ''}`}
    >
      <input
        type="checkbox"
        checked={!!todo.completedAt}
        onChange={() => onToggle(todo.id)}
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
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none font-medium"
      >
        削除
      </button>
    </div>
  );
} 