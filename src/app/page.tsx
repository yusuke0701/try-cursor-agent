import TodoList from './components/TodoList';
import { Todo } from './types/todo';

// 仮のTODOデータ
const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Next.jsの学習',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'TypeScriptの学習',
    createdAt: new Date(),
    completedAt: new Date(),
  },
  {
    id: '3',
    title: 'Tailwind CSSの学習',
    createdAt: new Date(),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <TodoList initialTodos={mockTodos} />
      </div>
    </main>
  );
}
