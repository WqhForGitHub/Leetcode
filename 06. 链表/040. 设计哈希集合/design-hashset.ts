// ============================================================
// 040. 设计哈希集合
// ============================================================
// LeetCode 705. Design HashSet
// 不使用内建哈希库，实现一个 MyHashSet 类，支持 add / remove / contains。
// 方法1：拉链法（数组 + 链表）。
// 方法2：大数组直接映射。
// 时间复杂度：平均 O(1)，最坏 O(n)；空间复杂度：O(数据规模)

// ===== 链表节点 =====
class SetNode {
  val: number;
  next: SetNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

// 方法1：拉链法实现
class MyHashSet {
  private base: number;
  private buckets: (SetNode | null)[];

  constructor() {
    this.base = 769; // 取一个质数减少冲突
    this.buckets = new Array(this.base).fill(null);
  }

  // 哈希函数
  private hash(key: number): number {
    return key % this.base;
  }

  add(key: number): void {
    const idx = this.hash(key);
    const head = this.buckets[idx];
    // 检查是否已存在
    let cur = head;
    while (cur) {
      if (cur.val === key) return; // 已存在
      cur = cur.next;
    }
    // 头插法
    const node = new SetNode(key);
    node.next = head;
    this.buckets[idx] = node;
  }

  remove(key: number): void {
    const idx = this.hash(key);
    const head = this.buckets[idx];
    if (!head) return;
    if (head.val === key) {
      this.buckets[idx] = head.next;
      return;
    }
    let prev: SetNode | null = head;
    let cur: SetNode | null = head.next;
    while (cur) {
      if (cur.val === key) {
        prev.next = cur.next;
        return;
      }
      prev = cur;
      cur = cur.next;
    }
  }

  contains(key: number): boolean {
    const idx = this.hash(key);
    let cur = this.buckets[idx];
    while (cur) {
      if (cur.val === key) return true;
      cur = cur.next;
    }
    return false;
  }
}

// 方法2：大数组直接映射（key 范围 0 ~ 10^6）
class MyHashSetBigArray {
  private data: boolean[];

  constructor() {
    this.data = new Array(1_000_001).fill(false);
  }

  add(key: number): void {
    this.data[key] = true;
  }

  remove(key: number): void {
    this.data[key] = false;
  }

  contains(key: number): boolean {
    return this.data[key];
  }
}

// ----------------------- 测试 -----------------------
function testHashSet(): void {
  const hs = new MyHashSet();
  hs.add(1);
  hs.add(2);
  console.log("contains(1) =>", hs.contains(1)); // true
  console.log("contains(3) =>", hs.contains(3)); // false
  hs.add(2);
  console.log("contains(2) =>", hs.contains(2)); // true
  hs.remove(2);
  console.log("contains(2) =>", hs.contains(2)); // false

  console.log("--- BigArray 方式 ---");
  const hs2 = new MyHashSetBigArray();
  hs2.add(1);
  hs2.add(2);
  console.log("contains(1) =>", hs2.contains(1)); // true
  hs2.remove(1);
  console.log("contains(1) =>", hs2.contains(1)); // false
}

testHashSet();

export {};
