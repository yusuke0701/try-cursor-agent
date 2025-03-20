import { FormEvent } from 'react';
import { Theme, themePresets } from '../types/theme';

interface TodoFormProps {
  title: string;
  dueDate: string;
  onTitleChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  theme: Theme;
}

export default function TodoForm({
  title,
  dueDate,
  onTitleChange,
  onDueDateChange,
  onSubmit,
  theme,
}: TodoFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="新しいTODOを入力"
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${themePresets[theme].input}`}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${themePresets[theme].input}`}
        />
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${themePresets[theme].submitButton}`}
        >
          追加
        </button>
      </div>
    </form>
  );
} 