// ============================================================
// 002. 用栈实现队列
// ============================================================
// LeetCode 232. Implement Queue using Stacks
// 请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作。

// ------------------------------------------------------------
// 方法1：两个栈，入栈时倾倒
// ------------------------------------------------------------
// inStack 接收入队元素，出队时若 outStack 为空，把 inStack 全部倒入 outStack 再出栈。
// 时间均摊 O(1)，空间 O(n)。
class MyQueue1 {
  private inStack: number[] = [];
  private outStack: number[] = [];

  push(x: number): void {
    this.inStack.push(x);
  }

  pop(): number {
    this.peek();
    return this.outStack.pop()!;
  }

  peek(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
    return this.outStack[this.outStack.length - 1];
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

// ------------------------------------------------------------
// 方法2：递归栈（单栈模拟）
// ------------------------------------------------------------
// 利用递归调用栈作为辅助栈，pop/peek 时递归取出栈底元素。
// 时间 O(n)，空间 O(n)。
class MyQueue2 {
  private stack: number[] = [];

  push(x: number): void {
    this.stack.push(x);
  }

  pop(): number {
    const top = this.stack.pop()!;
    if (this.stack.length === 0) {
      return top;
    }
    const result = this.pop();
    this.stack.push(top);
    return result;
  }

  peek(): number {
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
  const q1 = new MyQueue1();
  q1.push(1);
  q1.push(2);
  console.log("测试1 peek:", q1.peek(), "期望: 1");
  console.log("测试2 pop:", q1.pop(), "期望: 1");
  console.log("测试3 empty:", q1.empty(), "期望: false");

  const q2 = new MyQueue2();
  q2.push(1);
  q2.push(2);
  q2.push(3);
  console.log("测试4 peek:", q2.peek(), "期望: 1");
  console.log("测试5 pop:", q2.pop(), "期望: 1");
  console.log("测试6 pop:", q2.pop(), "期望: 2");
}

test();

export {};
