// ============================================================
// 065. 化栈为队
// ============================================================
// LeetCode LCR 041 / 剑指 Offer 09. 用两个栈实现队列
// 用两个栈实现一个队列，支持 appendTail 和 deleteHead 操作。

// ------------------------------------------------------------
// 方法1：输入栈 + 输出栈
// ------------------------------------------------------------
// 入队压入 inStack，出队时若 outStack 为空则将 inStack 全部倒入 outStack。
// 时间 O(1) 均摊，空间 O(n)。
class StackToQueue1 {
  private inStack: number[] = [];
  private outStack: number[] = [];

  push(value: number): void {
    this.inStack.push(value);
  }

  pop(): number {
    this.peek();
    return this.outStack.length > 0 ? this.outStack.pop()! : -1;
  }

  peek(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
    return this.outStack.length > 0
      ? this.outStack[this.outStack.length - 1]
      : -1;
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

// ------------------------------------------------------------
// 方法2：递归（单栈）
// ------------------------------------------------------------
// 利用递归调用栈作为辅助，pop/peek 时递归取出栈底元素。
// 时间 O(n)，空间 O(n)。
class StackToQueue2 {
  private stack: number[] = [];

  push(value: number): void {
    this.stack.push(value);
  }

  pop(): number {
    if (this.stack.length === 0) return -1;
    const top = this.stack.pop()!;
    if (this.stack.length === 0) {
      return top;
    }
    const result = this.pop();
    this.stack.push(top);
    return result;
  }

  peek(): number {
    if (this.stack.length === 0) return -1;
    const top = this.stack.pop()!;
    if (this.stack.length === 0) {
      this.stack.push(top);
      return top;
    }
    const result = this.peek();
    this.stack.push(top);
    return result;
  }

  empty(): boolean {
    return this.stack.length === 0;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const q1 = new StackToQueue1();
  q1.push(1);
  q1.push(2);
  q1.push(3);
  console.log("测试1 peek:", q1.peek(), "期望: 1");
  console.log("测试2 pop:", q1.pop(), "期望: 1");
  console.log("测试3 pop:", q1.pop(), "期望: 2");
  console.log("测试4 empty:", q1.empty(), "期望: false");

  const q2 = new StackToQueue2();
  q2.push(10);
  q2.push(20);
  console.log("测试5 peek:", q2.peek(), "期望: 10");
  console.log("测试6 pop:", q2.pop(), "期望: 10");
  console.log("测试7 pop:", q2.pop(), "期望: 20");
  console.log("测试8 empty:", q2.empty(), "期望: true");
}

test();

export {};
