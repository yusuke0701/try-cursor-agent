import { Todo } from '../types/todo';
import { Theme, themePresets } from '../types/theme';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: Date) => string;
  isOverdue: (dueDate?: Date) => boolean;
  theme: Theme;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  formatDate,
  isOverdue,
  theme,
}: TodoItemProps) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${themePresets[theme].container}`}>
      <input
        type="checkbox"
        checked={!!todo.completedAt}
        onChange={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded border-2 ${themePresets[theme].checkbox}`}
      />
      <div className="flex-1">
        <h3 className={`text-lg ${todo.completedAt ? themePresets[theme].completedTitle : themePresets[theme].title}`}>
          {todo.title}
        </h3>
        <div className={`flex gap-4 mt-1 text-sm ${themePresets[theme].dateContainer}`}>
          <span className={themePresets[theme].dateText}>
            作成: {formatDate(todo.createdAt)}
          </span>
          {todo.completedAt && (
            <span className={themePresets[theme].dateText}>
              完了: {formatDate(todo.completedAt)}
            </span>
          )}
          {todo.dueDate && !todo.completedAt && (
            <span className={isOverdue(todo.dueDate) ? themePresets[theme].overdueDate : themePresets[theme].dateText}>
              期限: {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className={`p-2 rounded-full hover:bg-opacity-10 transition-colors duration-200 ${themePresets[theme].deleteButton}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
} 