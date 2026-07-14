// ============================================================
// 018. 用栈实现队列
// ============================================================
// LeetCode 232. Implement Queue using Stacks
// 请你仅使用两个栈实现先入先出队列。

// ------------------------------------------------------------
// 方法1：双栈（输入栈 + 输出栈）
// ------------------------------------------------------------
// push 入输入栈；pop/peek 时若输出栈为空，把输入栈全部倒入输出栈再操作。
// 均摊 O(1)，空间 O(n)。
class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];

  push(x: number): void {
    this.inStack.push(x);
  }

  pop(): number {
    this.transfer();
    return this.outStack.pop()!;
  }

  peek(): number {
    this.transfer();
    return this.outStack[this.outStack.length - 1];
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }

  private transfer(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const q = new MyQueue();
  q.push(1);
  q.push(2);
  console.log("测试1 peek:", q.peek(), "期望: 1");
  console.log("测试2 pop:", q.pop(), "期望: 1");
  console.log("测试3 empty:", q.empty(), "期望: false");
}

test();

export {};
