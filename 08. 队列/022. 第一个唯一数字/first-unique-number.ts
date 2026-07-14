// ============================================================
// 022. 第一个唯一数字
// ============================================================
// LeetCode 1429. First Unique Number
// 设计一个数据结构，支持 add 和 showFirstUnique，返回第一个唯一数字。

// ------------------------------------------------------------
// 方法1：队列 + 双向计数 Map
// ------------------------------------------------------------
// 用队列保存候选唯一数字，Map 记录每个数字的出现次数。
// showFirstUnique 时清理队首重复数字。
// 时间 O(1) 均摊 add/showFirstUnique，空间 O(n)。
class FirstUnique1 {
  private queue: number[] = [];
  private count: Map<number, number> = new Map();

  constructor(nums: number[]) {
    for (const num of nums) {
      this.add(num);
    }
  }

  add(value: number): void {
    this.count.set(value, (this.count.get(value) || 0) + 1);
    this.queue.push(value);
  }

  showFirstUnique(): number {
    while (this.queue.length > 0 && this.count.get(this.queue[0])! > 1) {
      this.queue.shift();
    }
    return this.queue.length > 0 ? this.queue[0] : -1;
  }
}

// ------------------------------------------------------------
// 方法2：LinkedHashMap 风格（有序 Map + 双链表节点）
// ------------------------------------------------------------
// 用 Map 的插入顺序特性，配合计数，直接遍历找第一个 count 为 1 的。
// 时间 O(n) showFirstUnique 最坏，空间 O(n)。
class FirstUnique2 {
  private count: Map<number, number> = new Map();

  constructor(nums: number[]) {
    for (const num of nums) {
      this.add(num);
    }
  }

  add(value: number): void {
    this.count.set(value, (this.count.get(value) || 0) + 1);
  }

  showFirstUnique(): number {
    for (const [key, cnt] of this.count) {
      if (cnt === 1) return key;
    }
    return -1;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const f1 = new FirstUnique1([2, 3, 5]);
  console.log("测试1:", f1.showFirstUnique(), "期望: 2");
  f1.add(5);
  console.log("测试2:", f1.showFirstUnique(), "期望: 2");
  f1.add(2);
  console.log("测试3:", f1.showFirstUnique(), "期望: 3");
  f1.add(3);
  console.log("测试4:", f1.showFirstUnique(), "期望: -1");

  const f2 = new FirstUnique2([7, 7, 7, 7, 7, 7]);
  console.log("测试5:", f2.showFirstUnique(), "期望: -1");
  f2.add(3);
  f2.add(3);
  f2.add(7);
  f2.add(17);
  console.log("测试6:", f2.showFirstUnique(), "期望: 17");
}

test();

export {};
