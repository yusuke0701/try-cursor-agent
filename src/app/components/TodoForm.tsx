type TodoFormProps = {
  title: string;
  dueDate: string;
  onTitleChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function TodoForm({
  title,
  dueDate,
  onTitleChange,
  onDueDateChange,
  onSubmit,
}: TodoFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
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
            disabled={!title.trim()}
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
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="px-3 py-2 text-base border-2 border-gray-200 rounded-lg 
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              text-gray-900 bg-white
              transition-colors duration-200"
          />
        </div>
      </div>
    </form>
  );
} 