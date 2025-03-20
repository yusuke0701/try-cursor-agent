export type Todo = {
  id: string;
  title: string;
  createdAt: Date;
  completedAt?: Date; // 完了日時（完了していない場合はundefined）
}; 