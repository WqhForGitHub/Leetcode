// ============================================================
// 013. 最小栈
// ============================================================
// LeetCode 155. Min Stack
// 设计一个支持 push、pop、top 操作，并能在常数时间内检索到最小元素的栈。

// ------------------------------------------------------------
// 方法1：辅助栈
// ------------------------------------------------------------
// 维护一个同步的最小值栈，每次 push 时同步更新当前最小值。
// 时间：每个操作 O(1)；空间 O(n)。
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    } else {
      this.minStack.push(this.minStack[this.minStack.length - 1]);
    }
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

// ------------------------------------------------------------
// 方法2：单栈存差值（节省空间）
// ------------------------------------------------------------
// 用一个变量 min 记录最小值，栈中存「与当前 min 的差值」。
class MinStackDiff {
  private stack: number[] = [];
  private min: number = 0;

  push(val: number): void {
    if (this.stack.length === 0) {
      this.min = val;
      this.stack.push(0);
    } else {
      const diff = val - this.min;
      this.stack.push(diff);
      if (diff < 0) this.min = val;
    }
  }

  pop(): void {
    const diff = this.stack.pop()!;
    if (diff < 0) this.min = this.min - diff;
  }

  top(): number {
    const diff = this.stack[this.stack.length - 1];
    return diff > 0 ? this.min + diff : this.min;
  }

  getMin(): number {
    return this.min;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const ms = new MinStack();
  ms.push(-2);
  ms.push(0);
  ms.push(-3);
  console.log('测试1 getMin:', ms.getMin(), '期望: -3');
  ms.pop();
  console.log('测试2 top:', ms.top(), '期望: 0');
  console.log('测试3 getMin:', ms.getMin(), '期望: -2');

  const ms2 = new MinStackDiff();
  ms2.push(-2);
  ms2.push(0);
  ms2.push(-3);
  console.log('测试4 差值法 getMin:', ms2.getMin(), '期望: -3');
  ms2.pop();
  console.log('测试5 差值法 top:', ms2.top(), '期望: 0');
}

test();

export {};
