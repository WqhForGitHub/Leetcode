// ============================================================
// 047. 扁平化嵌套列表迭代器
// ============================================================
// LeetCode 341. Flatten Nested List Iterator
// 给你一个嵌套的整数列表 nestedList，每个元素要么是一个整数，
// 要么是一个列表。实现一个迭代器将其扁平化。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 嵌套整数接口
class NestedInteger {
  private _isInteger: boolean;
  private _value: number | NestedInteger[];

  constructor(value: number | NestedInteger[]) {
    if (typeof value === "number") {
      this._isInteger = true;
      this._value = value;
    } else {
      this._isInteger = false;
      this._value = value;
    }
  }

  isInteger(): boolean {
    return this._isInteger;
  }

  getInteger(): number | null {
    return this._isInteger ? (this._value as number) : null;
  }

  getList(): NestedInteger[] | null {
    return this._isInteger ? null : (this._value as NestedInteger[]);
  }
}

// 方法1：栈模拟（推荐）
// 使用栈从后向前压入元素，每次调用 next 前确保栈顶是整数
class NestedIterator1 {
  private stack: NestedInteger[] = [];

  constructor(nestedList: NestedInteger[]) {
    // 从后向前压栈，保证栈顶是第一个元素
    for (let i = nestedList.length - 1; i >= 0; i--) {
      this.stack.push(nestedList[i]);
    }
  }

  hasNext(): boolean {
    while (this.stack.length > 0) {
      const top = this.stack[this.stack.length - 1];
      if (top.isInteger()) {
        return true;
      }
      // 栈顶是列表，展开并重新压栈
      this.stack.pop();
      const list = top.getList()!;
      for (let i = list.length - 1; i >= 0; i--) {
        this.stack.push(list[i]);
      }
    }
    return false;
  }

  next(): number {
    return this.stack.pop()!.getInteger()!;
  }
}

// 方法2：递归展开
// 在构造时递归展开所有嵌套列表为一个扁平数组
class NestedIterator2 {
  private flattened: number[] = [];
  private index = 0;

  constructor(nestedList: NestedInteger[]) {
    this.flatten(nestedList);
  }

  private flatten(list: NestedInteger[]): void {
    for (const item of list) {
      if (item.isInteger()) {
        this.flattened.push(item.getInteger()!);
      } else {
        this.flatten(item.getList()!);
      }
    }
  }

  hasNext(): boolean {
    return this.index < this.flattened.length;
  }

  next(): number {
    return this.flattened[this.index++];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 扁平化嵌套列表迭代器 =====");
// 构造嵌套列表 [[1,1],2,[1,1]]
const nestedList1: NestedInteger[] = [
  new NestedInteger([
    new NestedInteger(1),
    new NestedInteger(1),
  ]),
  new NestedInteger(2),
  new NestedInteger([
    new NestedInteger(1),
    new NestedInteger(1),
  ]),
];
const iter1 = new NestedIterator1(nestedList1);
const result1: number[] = [];
while (iter1.hasNext()) {
  result1.push(iter1.next());
}
console.log("栈模拟 [[1,1],2,[1,1]]:", result1); // 期望结果 [1,1,2,1,1]

// 构造嵌套列表 [1,[4,[6]]]
const nestedList2: NestedInteger[] = [
  new NestedInteger(1),
  new NestedInteger([
    new NestedInteger(4),
    new NestedInteger([new NestedInteger(6)]),
  ]),
];
const iter2 = new NestedIterator2(nestedList2);
const result2: number[] = [];
while (iter2.hasNext()) {
  result2.push(iter2.next());
}
console.log("递归展开 [1,[4,[6]]]:", result2); // 期望结果 [1,4,6]

export {};
