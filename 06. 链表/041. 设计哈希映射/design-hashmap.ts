// ============================================================
// 041. 设计哈希映射
// ============================================================
// LeetCode 706. Design HashMap
// 不使用内建哈希库，实现一个 MyHashMap 类，支持 put / get / remove。
// 方法1：拉链法（数组 + 链表，链表节点存 [key, value] 对）。
// 方法2：大数组直接映射。
// 时间复杂度：平均 O(1)，最坏 O(n)；空间复杂度：O(数据规模)

// ===== 链表节点，存储键值对 =====
class PairNode {
  key: number;
  val: number;
  next: PairNode | null = null;
  constructor(key: number, val: number) {
    this.key = key;
    this.val = val;
  }
}

// 方法1：拉链法实现
class MyHashMap {
  private base: number;
  private buckets: (PairNode | null)[];

  constructor() {
    this.base = 769; // 质数减少冲突
    this.buckets = new Array(this.base).fill(null);
  }

  private hash(key: number): number {
    return key % this.base;
  }

  // 插入或更新 key 对应的 value
  put(key: number, value: number): void {
    const idx = this.hash(key);
    const head = this.buckets[idx];
    let cur = head;
    while (cur) {
      if (cur.key === key) {
        cur.val = value; // 已存在则更新
        return;
      }
      cur = cur.next;
    }
    // 头插法
    const node = new PairNode(key, value);
    node.next = head;
    this.buckets[idx] = node;
  }

  // 返回 key 对应的 value，不存在返回 -1
  get(key: number): number {
    const idx = this.hash(key);
    let cur = this.buckets[idx];
    while (cur) {
      if (cur.key === key) return cur.val;
      cur = cur.next;
    }
    return -1;
  }

  // 删除指定 key
  remove(key: number): void {
    const idx = this.hash(key);
    const head = this.buckets[idx];
    if (!head) return;
    if (head.key === key) {
      this.buckets[idx] = head.next;
      return;
    }
    let prev: PairNode | null = head;
    let cur: PairNode | null = head.next;
    while (cur) {
      if (cur.key === key) {
        prev.next = cur.next;
        return;
      }
      prev = cur;
      cur = cur.next;
    }
  }
}

// 方法2：大数组直接映射（key 范围 0 ~ 10^6）
class MyHashMapBigArray {
  private data: number[];

  constructor() {
    // 用 -1 表示不存在
    this.data = new Array(1_000_001).fill(-1);
  }

  put(key: number, value: number): void {
    this.data[key] = value;
  }

  get(key: number): number {
    return this.data[key];
  }

  remove(key: number): void {
    this.data[key] = -1;
  }
}

// ----------------------- 测试 -----------------------
function testHashMap(): void {
  const hm = new MyHashMap();
  hm.put(1, 1);
  hm.put(2, 2);
  console.log("get(1) =>", hm.get(1)); // 1
  console.log("get(3) =>", hm.get(3)); // -1
  hm.put(2, 1); // 更新
  console.log("get(2) =>", hm.get(2)); // 1
  hm.remove(2);
  console.log("get(2) =>", hm.get(2)); // -1

  console.log("--- BigArray 方式 ---");
  const hm2 = new MyHashMapBigArray();
  hm2.put(1, 10);
  hm2.put(2, 20);
  console.log("get(1) =>", hm2.get(1)); // 10
  hm2.remove(1);
  console.log("get(1) =>", hm2.get(1)); // -1
}

testHashMap();

export {};
