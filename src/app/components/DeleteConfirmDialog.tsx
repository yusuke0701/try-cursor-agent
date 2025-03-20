import { Theme, themePresets } from '../types/theme';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  theme: Theme;
}

export default function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  theme,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 ${themePresets[theme].container}`}>
        <h2 className={`text-xl font-bold mb-4 ${themePresets[theme].heading}`}>
          削除の確認
        </h2>
        <p className={`mb-6 ${themePresets[theme].text}`}>
          このTODOを削除してもよろしいですか？
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${themePresets[theme].themeButton}`}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${themePresets[theme].submitButton}`}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
} 