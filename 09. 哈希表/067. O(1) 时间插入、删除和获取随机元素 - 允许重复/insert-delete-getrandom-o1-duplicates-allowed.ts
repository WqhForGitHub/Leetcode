// ============================================================
// 067. O(1) 时间插入、删除和获取随机元素 - 允许重复
// ============================================================
// LeetCode 381. Insert Delete GetRandom O(1) - Duplicates Allowed
// 同 066，但允许插入重复元素。remove(val) 每次删除其中一个 val。
// 思路：数组存值 + 哈希表存 值->索引集合。删除时取 val 的任一索引，
//       与末尾交换后 pop，并同步更新末尾值在哈希表中的索引集合。
// 时间复杂度：insert / remove / getRandom 均摊 O(1)
// 空间复杂度：O(N)

class RandomizedCollection {
  // 值数组
  private values: number[];
  // 值 -> 该值在数组中的所有索引集合
  private indexMap: Map<number, Set<number>>;

  constructor() {
    this.values = [];
    this.indexMap = new Map();
  }

  insert(val: number): boolean {
    // 返回 true 表示集合中原本不存在该值
    const notPresent = !this.indexMap.has(val);
    if (notPresent) {
      this.indexMap.set(val, new Set<number>());
    }
    const idx = this.values.length;
    this.values.push(val);
    this.indexMap.get(val)!.add(idx);
    return notPresent;
  }

  remove(val: number): boolean {
    const set = this.indexMap.get(val);
    if (!set || set.size === 0) return false;

    // 取 val 的任意一个索引
    const idx = set.values().next().value as number;
    set.delete(idx);

    const last = this.values[this.values.length - 1];
    if (idx !== this.values.length - 1) {
      // 把末尾元素搬到 idx
      this.values[idx] = last;
      const lastSet = this.indexMap.get(last)!;
      lastSet.delete(this.values.length - 1); // 移除旧的末尾索引
      lastSet.add(idx); // 添加新索引
    }
    this.values.pop();

    // 若该值集合已空，则删除键
    if (set.size === 0) {
      this.indexMap.delete(val);
    }
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
console.log("===== 067. O(1) 时间插入、删除和获取随机元素 - 允许重复 =====");

// 测试 1：重复插入
const col1 = new RandomizedCollection();
console.log("test1 insert 1 (first):", col1.insert(1)); // true
console.log("test1 insert 1 (dup):", col1.insert(1)); // false（已存在，但仍插入）
console.log("test1 insert 2:", col1.insert(2)); // true
// 数组现在为 [1, 1, 2]，随机获取应为其中之一
const r = col1.getRandom();
console.log("test1 random (1/1/2):", r); // 期望 1 或 2
console.log("test1 random valid:", r === 1 || r === 2); // true

// 测试 2：删除重复元素
const col2 = new RandomizedCollection();
col2.insert(1);
col2.insert(1);
col2.insert(2);
// 删除一个 1，应剩一个 1 和一个 2
console.log("test2 remove 1:", col2.remove(1)); // true
console.log("test2 remove 1 again:", col2.remove(1)); // true
console.log("test2 remove 1 (none):", col2.remove(1)); // false（已无 1）
// 现在只剩 2
console.log("test2 random:", col2.getRandom()); // 期望 2

// 测试 3：删除中间元素后结构正确
const col3 = new RandomizedCollection();
col3.insert(10);
col3.insert(20);
col3.insert(20);
col3.insert(30);
// 删除 20（其中一个），数组长度应变为 3
col3.remove(20);
// 随机获取应只可能是 10、20、30 之一
const x = col3.getRandom();
console.log("test3 random valid:", x === 10 || x === 20 || x === 30); // true

export {};
