import { Todo } from '../types/todo';

type TodoItemStyles = {
  container?: string;
  checkbox?: string;
  title?: string;
  titleCompleted?: string;
  dateContainer?: string;
  dateText?: string;
  dateOverdue?: string;
  deleteButton?: string;
};

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: Date) => string;
  isOverdue: (dueDate?: Date) => boolean;
  styles?: TodoItemStyles;
};

const defaultStyles: TodoItemStyles = {
  container: 'flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200',
  checkbox: 'w-5 h-5 mr-3 cursor-pointer accent-blue-500',
  title: 'block text-base leading-relaxed text-gray-800',
  titleCompleted: 'line-through text-gray-500',
  dateContainer: 'text-sm text-gray-500 mt-1',
  dateText: 'ml-2',
  dateOverdue: 'text-red-500',
  deleteButton: 'px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none font-medium',
};

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  formatDate,
  isOverdue,
  styles = {},
}: TodoItemProps) {
  // デフォルトのスタイルとカスタムスタイルをマージ
  const mergedStyles = {
    container: `${defaultStyles.container} ${styles.container || ''}`,
    checkbox: `${defaultStyles.checkbox} ${styles.checkbox || ''}`,
    title: `${defaultStyles.title} ${styles.title || ''}`,
    titleCompleted: `${defaultStyles.titleCompleted} ${styles.titleCompleted || ''}`,
    dateContainer: `${defaultStyles.dateContainer} ${styles.dateContainer || ''}`,
    dateText: `${defaultStyles.dateText} ${styles.dateText || ''}`,
    dateOverdue: `${defaultStyles.dateOverdue} ${styles.dateOverdue || ''}`,
    deleteButton: `${defaultStyles.deleteButton} ${styles.deleteButton || ''}`,
  };

  return (
    <div
      className={`${mergedStyles.container} ${
        !todo.completedAt && todo.dueDate && isOverdue(todo.dueDate) ? 'border-2 border-red-500' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={!!todo.completedAt}
        onChange={() => onToggle(todo.id)}
        className={mergedStyles.checkbox}
      />
      <div className="flex-1">
        <span className={`${mergedStyles.title} ${todo.completedAt ? mergedStyles.titleCompleted : ''}`}>
          {todo.title}
        </span>
        <div className={mergedStyles.dateContainer}>
          <span>作成: {formatDate(todo.createdAt)}</span>
          {todo.completedAt && (
            <span className={mergedStyles.dateText}>完了: {formatDate(todo.completedAt)}</span>
          )}
          {todo.dueDate && (
            <span className={`${mergedStyles.dateText} ${!todo.completedAt && isOverdue(todo.dueDate) ? mergedStyles.dateOverdue : ''}`}>
              期限: {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className={mergedStyles.deleteButton}
      >
        削除
      </button>
    </div>
  );
} 