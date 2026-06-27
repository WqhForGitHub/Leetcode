// ============================================================
// 001. 用队列实现栈
// ============================================================
// LeetCode 225. Implement Stack using Queues
// 请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作。

// ------------------------------------------------------------
// 方法1：两个队列
// ------------------------------------------------------------
// 入栈时把新元素加入空队列 q2，再把 q1 的元素依次搬过来，
// 交换 q1 与 q2，这样 q1 的队首始终是栈顶。
// 时间 O(n) 入栈，O(1) 出栈/取顶；空间 O(n)。
class MyStack1 {
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
// 方法2：一个队列
// ------------------------------------------------------------
// 入栈后将队列前 n-1 个元素依次出队再入队，队首即栈顶。
// 时间 O(n) 入栈，O(1) 出栈/取顶；空间 O(n)。
class MyStack2 {
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
// 测试
// ------------------------------------------------------------
function test(): void {
  const s1 = new MyStack1();
  s1.push(1);
  s1.push(2);
  console.log("测试1 top:", s1.top(), "期望: 2");
  console.log("测试2 pop:", s1.pop(), "期望: 2");
  console.log("测试3 empty:", s1.empty(), "期望: false");

  const s2 = new MyStack2();
  s2.push(1);
  s2.push(2);
  s2.push(3);
  console.log("测试4 top:", s2.top(), "期望: 3");
  console.log("测试5 pop:", s2.pop(), "期望: 3");
  console.log("测试6 pop:", s2.pop(), "期望: 2");
  console.log("测试7 empty:", s2.empty(), "期望: false");
}

test();

export {};
