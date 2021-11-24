import Elem from '@src/types/Elem';

class ElemManager {
  private exerciseName: Elem;

  private message: Elem;

  private count: Elem;

  private debug: Elem;

  constructor() {
    this.exerciseName = new Elem('exercise-name', '운동 이름');
    this.message = new Elem('message', '운동 안내메시지');
    this.count = new Elem('count', 0);
    this.debug = new Elem('debug-panel', undefined);
  }

  // 디버그 패널 캔버스 객체 반환
  getDebugPanel() { return this.debug.getElem() as HTMLCanvasElement; }

  // 운동 이름 UI 업데이트하기
  updateExerciseName(newExerciseName: string) {
    const elem = this.exerciseName.getElem();

    if (elem === null) return;

    this.exerciseName.setContent(newExerciseName);
    elem.innerText = this.exerciseName.getContent();
  }

  // 안내 문구 UI 업데이트하기
  updateMessage(newMessage: string) {
    const elem = this.message.getElem();

    if (elem === null) return;

    this.message.setContent(newMessage);
    elem.innerText = this.message.getContent();
  }

  // 목표 수행 횟수 표시하는 빈 원의 개수를 업데이트하기
  updateGoal(newGoal: number) {
    const createCircle = (): HTMLDivElement => {
      const circle = document.createElement('div');
      circle.className = 'circle';
      return circle;
    };

    const elem = this.count.getElem();

    if (elem === null) return;

    // 기존에 만들어진 원을 삭제한다.
    for (let idx = 0; idx < elem.children.length; idx++) {
      elem.removeChild(elem.children[idx]);
    }

    this.count.setContent(newGoal);
    // 새로운 목표 횟수만큼 빈 원을 추가한다.
    [...Array(this.count.getContent())].forEach(() => {
      elem.appendChild(createCircle());
    });
  }

  // 수행한 횟수만큼 원을 채운다.
  updateCount(to: number) {
    const elem = this.count.getElem();

    if (elem === null) return;

    // 그려진 원들을 가져온다.
    const circles = elem.children;
    // 수행한 횟수만큼 원의 불을 켠다.
    for (let idx = 0; idx < circles.length; idx++) {
      circles[idx].className = 'circle';
      if (idx < to) circles[idx].className += ' active';
    }
  }
}

export default ElemManager;
