// ============================================================
// 005. 扁平化嵌套列表迭代器
// ============================================================
// LeetCode 341. Flatten Nested List Iterator
// 给你一个嵌套的整数列表 nestedList，每个元素要么是整数，要么是列表。
// 实现一个迭代器将其扁平化，使你可以遍历其中所有整数。

// ------------------------------------------------------------
// 方法1：栈（惰性展开）
// ------------------------------------------------------------
// 用栈保存迭代器，每次取栈顶，若为整数直接返回，若为列表则展开入栈。
// 时间 O(1) 均摊 hasNext/next，空间 O(d)（d 为最大嵌套深度）。
interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  getList(): NestedInteger[] | null;
}

class NestedIterator1 implements Iterator<number> {
  private stack: { list: NestedInteger[]; index: number }[] = [];

  constructor(nestedList: NestedInteger[]) {
    this.stack.push({ list: nestedList, index: 0 });
  }

  next(): number {
    const result = this.peek();
    this.stack[this.stack.length - 1].index++;
    return result;
  }

  private peek(): number {
    while (this.stack.length > 0) {
      const top = this.stack[this.stack.length - 1];
      if (top.index >= top.list.length) {
        this.stack.pop();
        continue;
      }
      const elem = top.list[top.index];
      if (elem.isInteger()) {
        return elem.getInteger()!;
      } else {
        this.stack.push({ list: elem.getList()!, index: 0 });
      }
    }
    throw new Error("No more elements");
  }

  hasNext(): boolean {
    try {
      this.peek();
      return true;
    } catch {
      return false;
    }
  }
}

// ------------------------------------------------------------
// 方法2：递归预处理扁平化
// ------------------------------------------------------------
// 构造时递归遍历整棵嵌套树，把所有整数收集到数组中，再逐个返回。
// 时间 O(n) 构造，O(1) next/hasNext；空间 O(n)。
class NestedIterator2 {
  private flattened: number[] = [];
  private index: number = 0;

  constructor(nestedList: NestedInteger[]) {
    this.flatten(nestedList);
  }

  private flatten(list: NestedInteger[]): void {
    for (const ni of list) {
      if (ni.isInteger()) {
        this.flattened.push(ni.getInteger()!);
      } else {
        this.flatten(ni.getList()!);
      }
    }
  }

  next(): number {
    return this.flattened[this.index++];
  }

  hasNext(): boolean {
    return this.index < this.flattened.length;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 模拟 NestedInteger
  const makeNI = (val: number | NestedInteger[]): NestedInteger => {
    const isInt = typeof val === "number";
    return {
      isInteger: () => isInt,
      getInteger: () => (isInt ? (val as number) : null),
      getList: () => (isInt ? null : (val as NestedInteger[])),
    };
  };

  // [[1,1],2,[1,1]]
  const nestedList: NestedInteger[] = [
    makeNI([makeNI(1), makeNI(1)]),
    makeNI(2),
    makeNI([makeNI(1), makeNI(1)]),
  ];

  const it1 = new NestedIterator1(nestedList);
  const result1: number[] = [];
  while (it1.hasNext()) result1.push(it1.next());
  console.log("测试1:", JSON.stringify(result1), "期望: [1,1,2,1,1]");

  const it2 = new NestedIterator2(nestedList);
  const result2: number[] = [];
  while (it2.hasNext()) result2.push(it2.next());
  console.log("测试2:", JSON.stringify(result2), "期望: [1,1,2,1,1]");
}

test();

export {};
