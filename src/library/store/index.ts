interface Result { course: string; date: Date; success: boolean; }

// 한 개의 운동 결과만 고려함
export const saveResult = (course: string, date: Date, success: boolean) => {
  const key = 'result';
  const result: Result = { course, date, success };
  const resultFormatted = JSON.stringify(result);
  localStorage.setItem(key, resultFormatted);
};

export default { saveResult };
