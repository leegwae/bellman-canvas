export interface Result { exercise: string; date: number; hadSucceeded: boolean; }
export interface Course { id: string; exercise: string; exerciseName: string; repeat: number; }
interface Settings { courses: Course[]; interval: number; playSound: boolean; }

// 로컬 스토리지 키
const KEY_RESULTS = 'results';
const KEY_SETTINGS = 'settings';

export const setTempSettings = () => {
  const courses: Course[] = [{
    exerciseName: '숨쉬기 운동', exercise: 'breathing', repeat: 3, id: '',
  },
  {
    exerciseName: '옆구리 운동', exercise: 'side', repeat: 2, id: '',
  }];

  localStorage.setItem(KEY_SETTINGS, JSON.stringify({ courses, interval: 0, playSound: true }));
};

export const getCourseSettings = (): Course[] | null => {
  const saved = localStorage.getItem(KEY_SETTINGS);
  const parsed: Course[] | null = saved && JSON.parse(saved).courses;

  return parsed;
};

const getPreviousResults = (): Result[] | null => {
  const saved = localStorage.getItem(KEY_RESULTS);
  const parsed: Result[] | null = saved && JSON.parse(saved);

  return parsed;
};

export const saveResults = (exercise: string, date: number, hadSucceeded: boolean) => {
  const cur: Result = { exercise, date, hadSucceeded };
  const prev: Result[] | null = getPreviousResults();
  const formatted = JSON.stringify(prev ? [...prev, cur] : [cur]);
  localStorage.setItem(KEY_RESULTS, formatted);
};

export const clearResults = () => {
  localStorage.removeItem(KEY_RESULTS);
};
