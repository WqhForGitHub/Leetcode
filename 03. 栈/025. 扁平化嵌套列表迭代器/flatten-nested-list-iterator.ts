// ============================================================
// 025. 扁平化嵌套列表迭代器
// ============================================================
// LeetCode 341. Flatten Nested List Iterator
// 给定一个嵌套的整数列表，实现一个迭代器使其能扁平化输出。

interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  getList(): NestedInteger[];
}

// ------------------------------------------------------------
// 方法1：栈（懒展开）
// ------------------------------------------------------------
// 栈顶始终保证是一个整数或未展开的列表。每次 next 前 hasNext 展开。
// 时间均摊 O(1)，空间 O(深度)。
class NestedIterator {
  private stack: NestedInteger[] = [];

  constructor(nestedList: NestedInteger[]) {
    // 逆序入栈，保证从第一个开始
    for (let i = nestedList.length - 1; i >= 0; i--) {
      this.stack.push(nestedList[i]);
    }
  }

  next(): number {
    return this.stack.pop()!.getInteger()!;
  }

  hasNext(): boolean {
    while (this.stack.length > 0) {
      const top = this.stack[this.stack.length - 1];
      if (top.isInteger()) return true;
      // 顶层是列表，展开它
      this.stack.pop();
      const list = top.getList();
      for (let i = list.length - 1; i >= 0; i--) {
        this.stack.push(list[i]);
      }
    }
    return false;
  }
}

// ------------------------------------------------------------
// 测试（模拟 NestedInteger）
// ------------------------------------------------------------
class NestedIntegerImpl implements NestedInteger {
  constructor(private val: number | NestedInteger[]) {}
  isInteger(): boolean {
    return typeof this.val === 'number';
  }
  getInteger(): number | null {
    return typeof this.val === 'number' ? this.val : null;
  }
  getList(): NestedInteger[] {
    return typeof this.val === 'number' ? [] : this.val;
  }
}

function test(): void {
  // [[1,1],2,[1,1]]
  const list = [
    new NestedIntegerImpl([new NestedIntegerImpl(1), new NestedIntegerImpl(1)]),
    new NestedIntegerImpl(2),
    new NestedIntegerImpl([new NestedIntegerImpl(1), new NestedIntegerImpl(1)]),
  ];
  const it = new NestedIterator(list);
  const result: number[] = [];
  while (it.hasNext()) result.push(it.next());
  console.log('测试1:', result, '期望: [1,1,2,1,1]');
}

test();

export {};
