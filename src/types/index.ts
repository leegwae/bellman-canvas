export class Elem {
  private elem: HTMLElement | null;

  private content: any;

  constructor(elementId: string, content: any = undefined) {
    this.elem = document.getElementById(elementId);
    this.content = content;
  }

  getElem() { return this.elem; }

  getContent() { return this.content; }

  setContent(newContent: any) {
    if (this.elem) this.content = newContent;
  }
}

class Manager {
  private course: Elem;

  private message: Elem;

  private goal: Elem;

  private debug: Elem;

  private currentCount: number;

  constructor() {
    this.course = new Elem('course', '운동이름');
    this.message = new Elem('message', '운동 안내메시지');
    this.goal = new Elem('count', 0);
    this.debug = new Elem('debugging', undefined);

    this.currentCount = 0;
  }

  // 현재 반복 횟수와 목표 횟수가 같으면 true를 반환
  public isSuccess() { return this.currentCount === this.goal.getContent(); }

  // 현재 상태를 설정
  setCourse(content: string) {
    this.course.setContent(content);
  }

  setMessage(content: string) {
    this.message.setContent(content);
  }

  setGoal(content: number) {
    this.goal.setContent(content);
  }

  // 현재 상태를 반환
  getCurrentCourse() { return this.course.getContent(); }

  // 디버그 패널 캔버스 객체 반환
  getDebugPanel() { return this.debug.getElem() as HTMLCanvasElement; }

  // 현재 상태를 화면에 디스플레이
  updateCourse() {
    const elem = this.course.getElem();
    if (elem) elem.innerText = this.course.getContent();
  }

  updateMessage() {
    const elem = this.message.getElem();
    if (elem) elem.innerText = this.message.getContent();
  }

  updateGoal() {
    const createCircle = (): HTMLDivElement => {
      const circle = document.createElement('div');
      circle.className = 'circle';
      return circle;
    };

    const elem = this.goal.getElem();
    if (elem) {
      for (let idx = 0; idx < elem.children.length; idx++) {
        elem.removeChild(elem.children[idx]);
      }

      [...Array(this.goal.getContent())].forEach(() => {
        elem.appendChild(createCircle());
      });
    }
  }

  // ================= [ 현재 운동 횟수 관리 ] ====================================
  getCurrentCount() { return this.currentCount; }

  incrementCount() { this.currentCount += 1; }

  updateCount() {
    const elem = this.goal.getElem();
    if (elem) {
      const circles = elem.children;
      for (let idx = 0; idx < circles.length; idx++) {
        circles[idx].className = 'circle';
        if (idx < this.currentCount) circles[idx].className += ' active';
      }
    }
  }
}

export default Manager;
