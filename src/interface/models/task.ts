import {TaskAction} from "../enum/task-action";
import {TaskDetailsType} from "../other/task-details/task-details.type";

export interface Task {
  id: string;
  title: string;
  description: string;
  profit: number;
  action: TaskAction;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  link?: string;
  details?: TaskDetailsType;
  icon?: string;
}
