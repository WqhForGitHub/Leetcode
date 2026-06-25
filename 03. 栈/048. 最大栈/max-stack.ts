// ============================================================
// 048. 最大栈
// ============================================================
// LeetCode 716. Max Stack
// 设计一个支持 push、pop、top、peekMax、popMax 的栈。

// ------------------------------------------------------------
// 方法1：双栈
// ------------------------------------------------------------
// 主栈 + 最大值栈（同步维护）。popMax 需要把栈顶到 max 弹出再放回。
// 时间：push/pop/top/peekMax O(1)，popMax O(n)。
class MaxStack {
  private stack: number[] = [];
  private maxStack: number[] = [];

  push(x: number): void {
    this.stack.push(x);
    if (this.maxStack.length === 0 || x >= this.maxStack[this.maxStack.length - 1]) {
      this.maxStack.push(x);
    } else {
      this.maxStack.push(this.maxStack[this.maxStack.length - 1]);
    }
  }

  pop(): number {
    this.maxStack.pop();
    return this.stack.pop()!;
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  peekMax(): number {
    return this.maxStack[this.maxStack.length - 1];
  }

  popMax(): number {
    const maxVal = this.peekMax();
    const buffer: number[] = [];
    // 弹到栈顶等于 maxVal
    while (this.top() !== maxVal) {
      buffer.push(this.pop());
    }
    this.pop(); // 弹出 maxVal
    // 重新压回
    while (buffer.length > 0) {
      this.push(buffer.pop()!);
    }
    return maxVal;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const stk = new MaxStack();
  stk.push(5);
  stk.push(1);
  stk.push(5);
  console.log('测试1 top:', stk.top(), '期望: 5');
  console.log('测试2 popMax:', stk.popMax(), '期望: 5');
  console.log('测试3 top:', stk.top(), '期望: 1');
  console.log('测试4 peekMax:', stk.peekMax(), '期望: 5');
  console.log('测试5 pop:', stk.pop(), '期望: 1');
}

test();

export {};
