export interface Result { exerciseName: string; time: string; }
export interface Course { id: string; exercise: string; exerciseName: string; repeat: number; }
interface Settings { courses: Course[]; interval: number; playSound: boolean; }

// 로컬 스토리지 키
const KEY_RESULTS = 'results';
const KEY_SETTINGS = 'settings';

export const setTempSettings = () => {
  const courses: Course[] = [{
    exerciseName: '스쿼트', exercise: 'squat', repeat: 1, id: '',
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

export const saveResults = (exerciseName: string, time: string) => {
  const cur: Result = { exerciseName, time };
  const prev: Result[] | null = getPreviousResults();
  const formatted = JSON.stringify(prev ? [...prev, cur] : [cur]);
  localStorage.setItem(KEY_RESULTS, formatted);
};

export const removeResults = () => {
  localStorage.removeItem(KEY_RESULTS);
};
