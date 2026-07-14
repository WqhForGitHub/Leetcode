// ============================================================
// 025. 设计前中后队列
// ============================================================
// LeetCode 1670. Design Front Middle Back Queue
// 设计一个队列，支持从前、中、后插入和删除。

// ------------------------------------------------------------
// 方法1：双数组（两个 deque）
// ------------------------------------------------------------
// 用 left 和 right 两个数组，保持 left.length == right.length 或 left.length == right.length - 1。
// 中间元素始终为 left 的最后一个或 right 的第一个。
// 时间 O(n) pushMiddle/popMiddle，O(1) 其余；空间 O(n)。
class FrontMiddleBackQueue1 {
  private left: number[] = [];
  private right: number[] = [];

  private balance(): void {
    if (this.left.length > this.right.length) {
      this.right.unshift(this.left.pop()!);
    } else if (this.right.length > this.left.length + 1) {
      this.left.push(this.right.shift()!);
    }
  }

  pushFront(val: number): void {
    this.left.unshift(val);
    this.balance();
  }

  pushMiddle(val: number): void {
    if (this.left.length === this.right.length) {
      this.right.unshift(val);
    } else {
      this.left.push(val);
    }
    this.balance();
  }

  pushBack(val: number): void {
    this.right.push(val);
    this.balance();
  }

  popFront(): number {
    if (this.left.length === 0 && this.right.length === 0) return -1;
    if (this.left.length === 0) {
      return this.right.shift()!;
    }
    const val = this.left.shift()!;
    this.balance();
    return val;
  }

  popMiddle(): number {
    if (this.left.length === 0 && this.right.length === 0) return -1;
    let val: number;
    if (this.left.length === this.right.length) {
      val = this.left.pop()!;
    } else {
      val = this.right.shift()!;
    }
    this.balance();
    return val;
  }

  popBack(): number {
    if (this.right.length === 0) return -1;
    const val = this.right.pop()!;
    this.balance();
    return val;
  }
}

// ------------------------------------------------------------
// 方法2：单数组 + splice
// ------------------------------------------------------------
// 用一个数组，中间位置为 Math.floor(length / 2)。
// 时间 O(n) 所有操作，空间 O(n)。
class FrontMiddleBackQueue2 {
  private arr: number[] = [];

  pushFront(val: number): void {
    this.arr.unshift(val);
  }

  pushMiddle(val: number): void {
    this.arr.splice(Math.floor(this.arr.length / 2), 0, val);
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

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const q1 = new FrontMiddleBackQueue1();
  q1.pushFront(1);
  q1.pushBack(2);
  q1.pushMiddle(3);
  q1.pushMiddle(4);
  console.log("测试1 popFront:", q1.popFront(), "期望: 1");
  console.log("测试2 popMiddle:", q1.popMiddle(), "期望: 3");
  console.log("测试3 popMiddle:", q1.popMiddle(), "期望: 4");
  console.log("测试4 popBack:", q1.popBack(), "期望: 2");
  console.log("测试5 popFront:", q1.popFront(), "期望: -1");

  const q2 = new FrontMiddleBackQueue2();
  q2.pushFront(1);
  q2.pushBack(2);
  q2.pushMiddle(3);
  q2.pushMiddle(4);
  console.log("测试6 popFront:", q2.popFront(), "期望: 1");
  console.log("测试7 popMiddle:", q2.popMiddle(), "期望: 3");
  console.log("测试8 popBack:", q2.popBack(), "期望: 2");
}

test();

export {};
