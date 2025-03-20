type CelebrationDialogProps = {
  isOpen: boolean;
};

export default function CelebrationDialog({ isOpen }: CelebrationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center animate-bounce">
        <div className="text-6xl mb-4 animate-spin">🎉</div>
        <h2 className="text-2xl font-bold text-blue-600 mb-2">おめでとうございます！</h2>
        <p className="text-gray-700">全てのTODOを完了しました！</p>
        <div className="mt-4 text-sm text-gray-500">
          素晴らしい仕事をしました！
        </div>
      </div>
    </div>
  );
} 