// ============================================================
// 054. 设计浏览器历史记录
// ============================================================
// LeetCode 1472. Design Browser History
// 实现浏览器历史记录：从首页开始，支持 visit、back、forward。
// 时间复杂度：方法1 back/forward O(steps)；方法2 back/forward O(1)，visit O(steps)

// 方法1：双栈（back 栈 + forward 栈）
class BrowserHistory {
  private backStack: string[];
  private forwardStack: string[];
  private current: string;

  constructor(homepage: string) {
    this.current = homepage;
    this.backStack = [];
    this.forwardStack = [];
  }

  visit(url: string): void {
    this.backStack.push(this.current);
    this.current = url;
    this.forwardStack = []; // 访问新页面时清空前进记录
  }

  back(steps: number): string {
    while (steps > 0 && this.backStack.length > 0) {
      this.forwardStack.push(this.current);
      this.current = this.backStack.pop()!;
      steps--;
    }
    return this.current;
  }

  forward(steps: number): string {
    while (steps > 0 && this.forwardStack.length > 0) {
      this.backStack.push(this.current);
      this.current = this.forwardStack.pop()!;
      steps--;
    }
    return this.current;
  }
}

// 方法2：数组 + 指针（visit 时截断 forward 部分）
class BrowserHistory2 {
  private history: string[];
  private cur: number;

  constructor(homepage: string) {
    this.history = [homepage];
    this.cur = 0;
  }

  visit(url: string): void {
    this.cur++;
    this.history = this.history.slice(0, this.cur); // 截断前进部分
    this.history.push(url);
  }

  back(steps: number): string {
    this.cur = Math.max(0, this.cur - steps);
    return this.history[this.cur];
  }

  forward(steps: number): string {
    this.cur = Math.min(this.history.length - 1, this.cur + steps);
    return this.history[this.cur];
  }
}

// 测试
(function test() {
  const bh = new BrowserHistory("leetcode.com");
  bh.visit("google.com");
  bh.visit("facebook.com");
  bh.visit("youtube.com");
  console.log(bh.back(1)); // facebook.com
  console.log(bh.back(1)); // google.com
  console.log(bh.forward(1)); // facebook.com
  bh.visit("linkedin.com");
  console.log(bh.forward(2)); // linkedin.com
  console.log(bh.back(2)); // google.com
  console.log(bh.back(7)); // leetcode.com

  const bh2 = new BrowserHistory2("leetcode.com");
  bh2.visit("google.com");
  bh2.visit("facebook.com");
  bh2.visit("youtube.com");
  console.log(bh2.back(1)); // facebook.com
  console.log(bh2.forward(1)); // youtube.com
})();

export {};
