// ============================================================
// 058. 设计前中后队列
// ============================================================
// LeetCode 1670. Design Front Middle Back Queue
// 设计一个支持从前/中/后入队和出队的队列。
// pushMiddle 在下标 floor(n/2) 处插入；popMiddle 删除下标 floor((n-1)/2) 处元素。
// 时间复杂度：方法1 各操作 O(1) 均摊；方法2 中间操作 O(n)

// 方法1：两个双端队列（左 left、右 right）
// 维持不变式：left.length == right.length 或 left.length == right.length + 1
// 这样 popMiddle 永远是 left 的末尾元素。
class FrontMiddleBackQueue {
  private left: number[];
  private right: number[];

  constructor() {
    this.left = [];
    this.right = [];
  }

  // 平衡：保证 left.length == right.length 或 left.length == right.length + 1
  private rebalance(): void {
    if (this.left.length > this.right.length + 1) {
      // 左边多，把左末尾移到右头部
      this.right.unshift(this.left.pop()!);
    } else if (this.right.length > this.left.length) {
      // 右边多，把右头部移到左末尾
      this.left.push(this.right.shift()!);
    }
  }

  pushFront(val: number): void {
    this.left.unshift(val);
    this.rebalance();
  }

  pushMiddle(val: number): void {
    // 当左右相等时，直接加到左末尾（插入位置 floor(n/2)）
    // 当左比右多 1 时，先把左末尾移到右头部，再加到左末尾
    if (this.left.length === this.right.length) {
      this.left.push(val);
    } else {
      this.right.unshift(this.left.pop()!);
      this.left.push(val);
    }
  }

  pushBack(val: number): void {
    this.right.push(val);
    this.rebalance();
  }

  popFront(): number {
    if (this.left.length === 0) return -1;
    const val = this.left.shift()!;
    this.rebalance();
    return val;
  }

  popMiddle(): number {
    if (this.left.length === 0) return -1;
    const val = this.left.pop()!;
    this.rebalance();
    return val;
  }

  popBack(): number {
    if (this.right.length > 0) {
      const val = this.right.pop()!;
      this.rebalance();
      return val;
    } else if (this.left.length > 0) {
      const val = this.left.pop()!;
      this.rebalance();
      return val;
    }
    return -1;
  }
}

// 方法2：数组直接实现（splice 完成插入/删除）
class FrontMiddleBackQueue2 {
  private arr: number[];
  constructor() {
    this.arr = [];
  }
  pushFront(val: number): void {
    this.arr.unshift(val);
  }
  pushMiddle(val: number): void {
    const mid = Math.floor(this.arr.length / 2);
    this.arr.splice(mid, 0, val);
  }
  pushBack(val: number): void {
    this.arr.push(val);
  }
  popFront(): number {
    return this.arr.length === 0 ? -1 : this.arr.shift()!;
  }
  popMiddle(): number {
    if (this.arr.length === 0) return -1;
    const mid = Math.floor((this.arr.length - 1) / 2);
    return this.arr.splice(mid, 1)[0];
  }
  popBack(): number {
    return this.arr.length === 0 ? -1 : this.arr.pop()!;
  }
}

// 测试
(function test() {
  const q = new FrontMiddleBackQueue();
  q.pushFront(1); // [1]
  q.pushBack(2); // [1,2]
  q.pushMiddle(3); // [1,3,2]
  q.pushMiddle(4); // [1,4,3,2]
  console.log(q.popFront()); // 1 -> [4,3,2]
  console.log(q.popMiddle()); // 3 -> [4,2]
  console.log(q.popMiddle()); // 4 -> [2]
  console.log(q.popBack()); // 2 -> []
  console.log(q.popFront()); // -1

  const q2 = new FrontMiddleBackQueue2();
  q2.pushFront(1);
  q2.pushBack(2);
  q2.pushMiddle(3);
  q2.pushMiddle(4);
  console.log(q2.popFront()); // 1
  console.log(q2.popMiddle()); // 3
  console.log(q2.popMiddle()); // 4
  console.log(q2.popBack()); // 2
  console.log(q2.popFront()); // -1
})();

export {};
