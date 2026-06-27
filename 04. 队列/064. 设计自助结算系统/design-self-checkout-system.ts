// ============================================================
// 064. 设计自助结算系统
// ============================================================
// LeetCode LCR 041 / 剑指 Offer 59-II. 队列的最大值
// 设计一个队列，支持 push_back、pop_front 和 max_value 操作。
// 要求 max_value 时间复杂度 O(1)。

// ------------------------------------------------------------
// 方法1：双端队列辅助
// ------------------------------------------------------------
// 用普通队列保存数据，用单调递减双端队列维护最大值。
// 时间 O(1) 所有操作均摊，空间 O(n)。
class Checkout1 {
  private queue: number[] = [];
  private maxDeque: number[] = []; // 单调递减

  get_max(): number {
    return this.maxDeque.length > 0 ? this.maxDeque[0] : -1;
  }

  push_back(value: number): void {
    this.queue.push(value);
    while (
      this.maxDeque.length > 0 &&
      this.maxDeque[this.maxDeque.length - 1] < value
    ) {
      this.maxDeque.pop();
    }
    this.maxDeque.push(value);
  }

  pop_front(): number {
    if (this.queue.length === 0) return -1;
    const val = this.queue.shift()!;
    if (val === this.maxDeque[0]) {
      this.maxDeque.shift();
    }
    return val;
  }
}

// ------------------------------------------------------------
// 方法2：两个栈模拟队列（栈中维护最大值）
// ------------------------------------------------------------
// 用两个栈模拟队列，每个栈额外维护一个最大值栈。
// 时间 O(1) 均摊所有操作，空间 O(n)。
class Checkout2 {
  private inStack: number[] = [];
  private inMax: number[] = [];
  private outStack: number[] = [];
  private outMax: number[] = [];

  private pushToStack(stack: number[], maxStack: number[], val: number): void {
    stack.push(val);
    maxStack.push(
      maxStack.length === 0
        ? val
        : Math.max(maxStack[maxStack.length - 1], val),
    );
  }

  private popFromStack(stack: number[], maxStack: number[]): number {
    maxStack.pop();
    return stack.pop()!;
  }

  get_max(): number {
    const inMaxVal =
      this.inMax.length > 0 ? this.inMax[this.inMax.length - 1] : -Infinity;
    const outMaxVal =
      this.outMax.length > 0 ? this.outMax[this.outMax.length - 1] : -Infinity;
    const result = Math.max(inMaxVal, outMaxVal);
    return result === -Infinity ? -1 : result;
  }

  push_back(value: number): void {
    this.pushToStack(this.inStack, this.inMax, value);
  }

  pop_front(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        const val = this.popFromStack(this.inStack, this.inMax);
        this.pushToStack(this.outStack, this.outMax, val);
      }
    }
    if (this.outStack.length === 0) return -1;
    return this.popFromStack(this.outStack, this.outMax);
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const c1 = new Checkout1();
  console.log("测试1 get_max:", c1.get_max(), "期望: -1");
  c1.push_back(1);
  c1.push_back(2);
  console.log("测试2 get_max:", c1.get_max(), "期望: 2");
  console.log("测试3 pop_front:", c1.pop_front(), "期望: 1");
  console.log("测试4 get_max:", c1.get_max(), "期望: 2");

  const c2 = new Checkout2();
  c2.push_back(3);
  c2.push_back(1);
  console.log("测试5 get_max:", c2.get_max(), "期望: 3");
  console.log("测试6 pop_front:", c2.pop_front(), "期望: 3");
  console.log("测试7 get_max:", c2.get_max(), "期望: 1");
}

test();

export {};
