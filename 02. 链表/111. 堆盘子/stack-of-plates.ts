// ============================================================
// 111. 堆盘子
// ============================================================
// 面试题 03.03. 堆盘子 (Stack of Plates)
// 想象一堆盘子，叠到一定高度就新建一摞。实现一个数据结构 SetOfStacks，
// 由多个栈组成，每个栈容量上限为 capacity。当最后一个栈满时，新建一个栈。
// push：往最后一个栈压入（满了则新建栈）。
// pop：从最后一个栈弹出（栈空则删除该栈）。
// popAt：从指定索引的栈弹出（栈空则删除该栈）。
// 时间复杂度：push/pop O(1)（摊还），空间复杂度：O(n)

class StackOfPlates {
  // 存储多个栈的数组
  private stacks: number[][];
  // 每个栈的容量上限
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.stacks = [];
  }

  // 压入元素
  // 若容量 <= 0，直接忽略（边界处理）
  // 若没有栈或最后一个栈已满，则新建一个栈
  push(val: number): void {
    if (this.capacity <= 0) return;

    // 最后一个栈已满或没有栈，则新建栈
    const lastStack = this.stacks[this.stacks.length - 1];
    if (!lastStack || lastStack.length >= this.capacity) {
      this.stacks.push([]);
    }
    this.stacks[this.stacks.length - 1].push(val);
  }

  // 弹出最后一个栈的栈顶元素
  // 若没有栈，返回 -1
  // 弹出后若栈空，则删除该栈
  pop(): number {
    if (this.stacks.length === 0) return -1;

    const lastStack = this.stacks[this.stacks.length - 1];
    const val = lastStack.pop()!;

    // 弹出后若栈为空，则删除该栈
    if (lastStack.length === 0) {
      this.stacks.pop();
    }
    return val;
  }

  // 从指定索引的栈弹出元素
  // 若索引无效或该栈为空，返回 -1
  // 弹出后若栈为空，则从数组中移除该栈
  popAt(index: number): number {
    if (index < 0 || index >= this.stacks.length) return -1;

    const stack = this.stacks[index];
    if (stack.length === 0) return -1;

    const val = stack.pop()!;

    // 弹出后若栈为空，则移除该栈
    if (stack.length === 0) {
      this.stacks.splice(index, 1);
    }
    return val;
  }

  // 辅助方法：获取当前栈的数量
  getSize(): number {
    return this.stacks.length;
  }

  // 辅助方法：打印当前所有栈的状态
  printState(): void {
    console.log(
      "  栈状态:",
      this.stacks.map((s) => [...s])
    );
  }
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  console.log("===== 111. 堆盘子 测试 =====\n");

  // 测试1：基本 push 和 pop
  console.log("测试1: 基本操作 (capacity=3)");
  const sop1 = new StackOfPlates(3);
  sop1.push(1);
  sop1.push(2);
  sop1.push(3);
  sop1.push(4); // 新建第二摞
  sop1.push(5);
  sop1.push(6);
  sop1.push(7); // 新建第三摞
  sop1.printState();
  console.log("  栈数量:", sop1.getSize(), "(期望: 3)");

  console.log("  pop():", sop1.pop(), "(期望: 7)");
  sop1.printState();
  console.log("  pop():", sop1.pop(), "(期望: 6)");
  console.log("  pop():", sop1.pop(), "(期望: 5)");
  console.log("  pop():", sop1.pop(), "(期望: 4)");
  sop1.printState();
  console.log("  栈数量:", sop1.getSize(), "(期望: 1)\n");

  // 测试2：popAt 测试
  console.log("测试2: popAt 操作 (capacity=2)");
  const sop2 = new StackOfPlates(2);
  sop2.push(1);
  sop2.push(2); // 栈0: [1,2]
  sop2.push(3);
  sop2.push(4); // 栈1: [3,4]
  sop2.push(5);
  sop2.push(6); // 栈2: [5,6]
  sop2.printState();

  console.log("  popAt(0):", sop2.popAt(0), "(期望: 2)");
  sop2.printState();
  console.log("  popAt(0):", sop2.popAt(0), "(期望: 1, 栈0被删除)");
  sop2.printState();
  console.log("  栈数量:", sop2.getSize(), "(期望: 2)");
  console.log("  popAt(0):", sop2.popAt(0), "(期望: 4)");
  sop2.printState();
  console.log();

  // 测试3：空栈 pop 返回 -1
  console.log("测试3: 空栈操作");
  const sop3 = new StackOfPlates(2);
  console.log("  空 pop():", sop3.pop(), "(期望: -1)");
  console.log("  空 popAt(0):", sop3.popAt(0), "(期望: -1)");
  console.log("  popAt(-1):", sop3.popAt(-1), "(期望: -1)\n");

  // 测试4：capacity 为 0 的边界情况
  console.log("测试4: capacity = 0");
  const sop4 = new StackOfPlates(0);
  sop4.push(1);
  sop4.push(2);
  console.log("  push 后 pop():", sop4.pop(), "(期望: -1, 无法压入)");
  console.log("  栈数量:", sop4.getSize(), "(期望: 0)\n");

  // 测试5：连续 push 和 pop
  console.log("测试5: 连续操作 (capacity=2)");
  const sop5 = new StackOfPlates(2);
  sop5.push(1);
  sop5.push(2);
  console.log("  pop():", sop5.pop(), "(期望: 2)");
  console.log("  pop():", sop5.pop(), "(期望: 1)");
  console.log("  pop():", sop5.pop(), "(期望: -1, 已空)");
  sop5.push(10);
  console.log("  push(10) 后 pop():", sop5.pop(), "(期望: 10)");
  console.log();
}

test();

export {};
