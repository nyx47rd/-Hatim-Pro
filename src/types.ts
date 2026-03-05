export interface ReadingLog {
  id: string;
  taskId: string;
  date: string;
  pagesRead: number;
  absolutePage: number;
  note?: string;
}

export interface HatimTask {
  id: string;
  name: string;
  startPage: number;
  endPage: number;
  currentPage: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface HatimData {
  activeTaskId: string;
  tasks: HatimTask[];
  logs: ReadingLog[];
}
