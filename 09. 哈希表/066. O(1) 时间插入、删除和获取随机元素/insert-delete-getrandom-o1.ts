// ============================================================
// 066. O(1) 时间插入、删除和获取随机元素
// ============================================================
// LeetCode 380. Insert Delete GetRandom O(1)
// 设计一个数据结构，支持 O(1) 插入、删除、随机获取元素（元素唯一）。
// 思路：数组存值 + 哈希表存 值->索引。删除时把待删元素与末尾元素交换再 pop。
// 时间复杂度：insert / remove / getRandom 均为 O(1)
// 空间复杂度：O(N)

class RandomizedSet {
  // 值数组
  private values: number[];
  // 值 -> 在数组中的索引
  private indexMap: Map<number, number>;

  constructor() {
    this.values = [];
    this.indexMap = new Map();
  }

  insert(val: number): boolean {
    if (this.indexMap.has(val)) return false;
    this.indexMap.set(val, this.values.length);
    this.values.push(val);
    return true;
  }

  remove(val: number): boolean {
    if (!this.indexMap.has(val)) return false;
    const idx = this.indexMap.get(val)!;
    const last = this.values[this.values.length - 1];

    // 把末尾元素搬到 idx 处，更新其索引
    this.values[idx] = last;
    this.indexMap.set(last, idx);

    // 删除末尾
    this.values.pop();
    this.indexMap.delete(val);
    return true;
  }

  getRandom(): number {
    const i = Math.floor(Math.random() * this.values.length);
    return this.values[i];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. O(1) 时间插入、删除和获取随机元素 =====");

// 测试 1：基本插入与查询
const set1 = new RandomizedSet();
console.log("test1 insert 1:", set1.insert(1)); // true
console.log("test1 insert 2:", set1.insert(2)); // true
console.log("test1 insert 1 dup:", set1.insert(1)); // false（已存在）
console.log("test1 remove 3:", set1.remove(3)); // false（不存在）

// 测试 2：删除后随机获取仍正常
const set2 = new RandomizedSet();
set2.insert(10);
set2.insert(20);
set2.insert(30);
set2.remove(20); // 删除中间元素
// 随机获取应只返回 10 或 30
const rand = set2.getRandom();
console.log("test2 random (10 or 30):", rand); // 期望 10 或 30
console.log("test2 random valid:", rand === 10 || rand === 30); // true

// 测试 3：删除最后一个元素（边界情况）
const set3 = new RandomizedSet();
set3.insert(5);
set3.insert(6);
console.log("test3 remove 6 (last):", set3.remove(6)); // true
console.log("test3 remove 6 again:", set3.remove(6)); // false
console.log("test3 random:", set3.getRandom()); // 期望 5

export {};
