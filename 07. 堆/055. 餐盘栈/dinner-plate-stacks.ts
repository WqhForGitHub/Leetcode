// ============================================================
// 055. 餐盘栈
// ============================================================
// LeetCode 1172. Dinner Plate Stacks
// 设计一个不限数量的栈集合，容量为 capacity，支持 push/pop/atPop。
// 时间复杂度：push/pop O(log N)，atPop O(log N)

// 方法1：堆维护可用位置 + Map 存栈
class DinnerPlates {
  private capacity: number;
  private stacks: Map<number, number[]> = new Map();
  private leftHeap: number[] = []; // 最小堆：可 push 的栈索引
  private rightHeap: number[] = []; // 最大堆：非空栈索引
  private leftSet: Set<number> = new Set();
  private rightSet: Set<number> = new Set();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.leftPush(0);
  }
  private leftPush(v: number): void {
    if (this.leftSet.has(v)) return;
    this.leftSet.add(v);
    this.leftHeap.push(v);
    let i = this.leftHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.leftHeap[i] < this.leftHeap[p]) {
        [this.leftHeap[i], this.leftHeap[p]] = [this.leftHeap[p], this.leftHeap[i]];
        i = p;
      } else break;
    }
  }
  private leftPop(): number {
    while (this.leftHeap.length > 0) {
      const top = this.leftHeap[0];
      const last = this.leftHeap.pop()!;
      if (this.leftHeap.length > 0) {
        this.leftHeap[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < this.leftHeap.length && this.leftHeap[l] < this.leftHeap[s]) s = l;
          if (r < this.leftHeap.length && this.leftHeap[r] < this.leftHeap[s]) s = r;
          if (s !== i) {
            [this.leftHeap[i], this.leftHeap[s]] = [this.leftHeap[s], this.leftHeap[i]];
            i = s;
          } else break;
        }
      }
      if (this.leftSet.has(top)) {
        this.leftSet.delete(top);
        return top;
      }
    }
    return -1;
  }
  private rightPush(v: number): void {
    if (this.rightSet.has(v)) return;
    this.rightSet.add(v);
    this.rightHeap.push(-v);
    let i = this.rightHeap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.rightHeap[i] > this.rightHeap[p]) {
        [this.rightHeap[i], this.rightHeap[p]] = [this.rightHeap[p], this.rightHeap[i]];
        i = p;
      } else break;
    }
  }
  private rightPop(): number {
    while (this.rightHeap.length > 0) {
      const top = -this.rightHeap[0];
      const last = this.rightHeap.pop()!;
      if (this.rightHeap.length > 0) {
        this.rightHeap[0] = last;
        let i = 0;
        while (true) {
          let s = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < this.rightHeap.length && this.rightHeap[l] > this.rightHeap[s]) s = l;
          if (r < this.rightHeap.length && this.rightHeap[r] > this.rightHeap[s]) s = r;
          if (s !== i) {
            [this.rightHeap[i], this.rightHeap[s]] = [this.rightHeap[s], this.rightHeap[i]];
            i = s;
          } else break;
        }
      }
      if (this.rightSet.has(top)) {
        this.rightSet.delete(top);
        return top;
      }
    }
    return -1;
  }
  push(val: number): void {
    let idx = this.leftPop();
    if (idx === -1) {
      idx = this.stacks.size;
      this.stacks.set(idx, []);
    }
    const stack = this.stacks.get(idx)!;
    stack.push(val);
    if (stack.length < this.capacity) this.leftPush(idx);
    this.rightPush(idx);
  }
  pop(): number {
    const idx = this.rightPop();
    if (idx === -1) return -1;
    const stack = this.stacks.get(idx)!;
    const val = stack.pop()!;
    if (stack.length === 0) this.stacks.delete(idx);
    else this.rightPush(idx);
    this.leftPush(idx);
    return val;
  }
  popAtStack(index: number): number {
    const stack = this.stacks.get(index);
    if (stack === undefined || stack.length === 0) return -1;
    const val = stack.pop()!;
    if (stack.length === 0) this.stacks.delete(index);
    else this.rightPush(index);
    this.leftPush(index);
    return val;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 餐盘栈 =====");
const dp = new DinnerPlates(2);
dp.push(1);
dp.push(2);
dp.push(3);
dp.push(4);
dp.push(5);
console.log("popAt 0:", dp.popAtStack(0)); // 期望 2
dp.push(20);
dp.push(21);
console.log("popAt 0:", dp.popAtStack(0)); // 期望 20
console.log("popAt 2:", dp.popAtStack(2)); // 期望 21
console.log("pop:", dp.pop()); // 期望 5
console.log("pop:", dp.pop()); // 期望 4
console.log("pop:", dp.pop()); // 期望 3
console.log("pop:", dp.pop()); // 期望 1

export {};
