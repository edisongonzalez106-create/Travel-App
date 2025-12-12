export interface Trip {
  id: string;
  destination: string;
  coverImage: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  provider?: string;
  cost: number;
  date: string;
  timeStart?: string;
  timeEnd?: string;
  script?: string;
  completed: boolean;
}
