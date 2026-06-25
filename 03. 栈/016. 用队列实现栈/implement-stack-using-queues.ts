// ============================================================
// 016. 用队列实现栈
// ============================================================
// LeetCode 225. Implement Stack using Queues
// 请你仅使用两个队列实现一个后入先出（LIFO）的栈。

// ------------------------------------------------------------
// 方法1：单队列（push 时旋转）
// ------------------------------------------------------------
// 每次 push 后，把队列前面的 n-1 个元素依次出队再入队，使新元素位于队首。
// 时间 push O(n)，pop/top O(1)；空间 O(n)。
class MyStack {
  private queue: number[] = [];

  push(x: number): void {
    this.queue.push(x);
    const size = this.queue.length;
    for (let i = 0; i < size - 1; i++) {
      this.queue.push(this.queue.shift()!);
    }
  }

  pop(): number {
    return this.queue.shift()!;
  }

  top(): number {
    return this.queue[0];
  }

  empty(): boolean {
    return this.queue.length === 0;
  }
}

// ------------------------------------------------------------
// 方法2：双队列
// ------------------------------------------------------------
// push 到辅助队列，再把主队列全部追加到辅助队列后，交换主辅队列。
class MyStackTwoQueue {
  private q1: number[] = [];
  private q2: number[] = [];

  push(x: number): void {
    this.q2.push(x);
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift()!);
    }
    [this.q1, this.q2] = [this.q2, this.q1];
  }

  pop(): number {
    return this.q1.shift()!;
  }

  top(): number {
    return this.q1[0];
  }

  empty(): boolean {
    return this.q1.length === 0;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const s = new MyStack();
  s.push(1);
  s.push(2);
  console.log('测试1 top:', s.top(), '期望: 2');
  console.log('测试2 pop:', s.pop(), '期望: 2');
  console.log('测试3 empty:', s.empty(), '期望: false');
}

test();

export {};
