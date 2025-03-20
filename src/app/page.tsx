import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <TodoList initialTodos={[]} />
      </div>
    </main>
  );
}
