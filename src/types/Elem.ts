class Elem {
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

export default Elem;
