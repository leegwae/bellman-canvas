export interface CurrentExercise {
  exerciseName: string;
  message: string;
  goal: number;
  count: number;
}

class ExcerciseManager {
  private exerciseName: string;
  private message: string;
  private goal: number;
  private count: number;

  constructor() {
    this.exerciseName = '';
    this.message = '';
    this.goal = 0;
    this.count = 0;
  }

  setExerciseName(newExercise: string) { this.exerciseName = newExercise; }
  setMessage(newMessage: string) { this.message = newMessage; }
  setGoal(newGoal: number) { this.goal = newGoal; }
  setCountToZero() { this.count = 0; }
  incrementCount() { this.count += 1; }

  getExerciseName() { return this.exerciseName; }
  getMessage() { return this.message; }
  getGoal() { return this.goal; }
  getCount() { return this.count; }

  isSuccess() { return this.count === this.goal; }

  getCurrentExercise() {
    const currentExercise: CurrentExercise = {
      exerciseName: this.exerciseName,
      message: this.message,
      goal: this.goal,
      count: this.count,
    };

    return currentExercise;
  }
}

export default ExcerciseManager;
