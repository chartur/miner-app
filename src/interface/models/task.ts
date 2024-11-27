export interface Task {
  id: string;
  title: string;
  description: string;
  profit: number;
  link: string;
  icon: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
