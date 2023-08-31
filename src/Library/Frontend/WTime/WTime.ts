export class WTime extends HTMLElement {
    private timer: number;
    private targetDate: Date = new Date();
    private countDownDate: number = this.targetDate.setDate(this.targetDate.getDate() + 1);
    constructor() {
      super();
    }

    connectedCallback(): void {
      this.style.zIndex = "99999999999";
      this.style.backgroundColor = "white";
      this.style.color = "black";
      this.style.display ="block";
      this.style.position ="fixed";
      this.style.padding = "4px";
      this.style.fontSize = "9px";
      this.style.top = "4px";
      this.style.right = "4px";
      this.style.borderRadius = "4px";

      this.timer = window.setInterval(() => {
        this.updateTimer();
      }, 1000);
    }

    updateTimer(): void {

      const now: number = new Date().getTime();

      const hours: number = Math.floor(
        (now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes: number = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
      const seconds: number = Math.floor((now % (1000 * 60)) / 1000);
      this.innerHTML = `ZULU ${hours}:${minutes}:${seconds}`;
    }
  }

  customElements.define("w-time", WTime);
