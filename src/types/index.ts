import { saveResult } from '@src/library/store';

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

  private createCircle = () => {
    const circle = document.createElement('div');
    circle.className = 'circle';
    return circle;
  };

  private isSuccess = () => this.currentCount === this.goal.getContent();

  // ===================== [ local storage로 받아온 값 관리 ] =======================
  setCourse(content: string) {
    this.course.setContent(content);
  }

  setMessage(content: string) {
    this.message.setContent(content);
  }

  setGoal(content: number) {
    this.goal.setContent(content);
  }

  getDebugPanel() { return this.debug.getElem() as HTMLCanvasElement; }

  updateCourse() {
    const elem = this.course.getElem();
    if (elem) elem.innerText = this.course.getContent();
  }

  updateMessage() {
    const elem = this.message.getElem();
    if (elem) elem.innerText = this.message.getContent();
  }

  updateGoal() {
    const elem = this.goal.getElem();
    if (elem) {
      for (let idx = 0; idx < elem.children.length; idx++) {
        elem.removeChild(elem.children[idx]);
      }

      [...Array(this.goal.getContent())].forEach(() => {
        elem.appendChild(this.createCircle());
      });
    }
  }

  // ================= [ 현재 운동 횟수 관리 ] ====================================
  getCurrentCount() { return this.currentCount; }

  incrementCount() {
    this.currentCount += 1;

    // 목표와 현재 운동 성공 횟수가 같아지면 save
    if (this.isSuccess()) saveResult(this.course.getContent(), new Date(), this.isSuccess());
  }

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
