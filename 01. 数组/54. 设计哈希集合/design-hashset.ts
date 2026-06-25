// ============================================================
// 54. 设计哈希集合
// ============================================================
// LeetCode 705. Design HashSet
// 不使用内建哈希库，设计一个哈希集合。
// 包含 add(key)、remove(key)、contains(key) 方法。
// 时间复杂度：O(1) 均摊，空间复杂度：O(n)

// 链表节点：用于链地址法中桶内的链表
class ListNode {
  key: number;
  next: ListNode | null;
  constructor(key: number, next: ListNode | null = null) {
    this.key = key;
    this.next = next;
  }
}

// 方法1：链地址法-数组+链表（推荐）
// 桶数组 + 每个桶用单链表存储冲突元素
class MyHashSet {
  private buckets: (ListNode | null)[];
  private size: number;

  constructor() {
    this.size = 1009; // 取质数减少冲突
    this.buckets = new Array(this.size).fill(null);
  }

  private hash(key: number): number {
    return key % this.size;
  }

  add(key: number): void {
    const idx = this.hash(key);
    if (this.buckets[idx] === null) {
      this.buckets[idx] = new ListNode(key);
      return;
    }
    let cur: ListNode | null = this.buckets[idx];
    while (cur !== null) {
      if (cur.key === key) return; // 已存在，不重复添加
      if (cur.next === null) {
        cur.next = new ListNode(key);
        return;
      }
      cur = cur.next;
    }
  }

  remove(key: number): void {
    const idx = this.hash(key);
    const head = this.buckets[idx];
    if (head === null) return;

    if (head.key === key) {
      this.buckets[idx] = head.next;
      return;
    }
    let cur: ListNode | null = head;
    while (cur !== null && cur.next !== null) {
      if (cur.next.key === key) {
        cur.next = cur.next.next;
        return;
      }
      cur = cur.next;
    }
  }

  contains(key: number): boolean {
    const idx = this.hash(key);
    let cur: ListNode | null = this.buckets[idx];
    while (cur !== null) {
      if (cur.key === key) return true;
      cur = cur.next;
    }
    return false;
  }
}

// 方法2：大数组直接映射
// key 范围有限时，用一个大布尔数组直接映射，空间消耗大但实现极简
class MyHashSetLargeArray {
  private data: boolean[];

  constructor() {
    this.data = new Array(1000001).fill(false);
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

// ============================================================
// 测试
// ============================================================
console.log("===== 54. 设计哈希集合 =====");
const hashSet = new MyHashSet();
hashSet.add(1);
hashSet.add(2);
console.log("描述:", hashSet.contains(1)); // 期望结果: true
console.log("描述:", hashSet.contains(3)); // 期望结果: false
hashSet.add(2);
console.log("描述:", hashSet.contains(2)); // 期望结果: true
hashSet.remove(2);
console.log("描述:", hashSet.contains(2)); // 期望结果: false

const hashSetLarge = new MyHashSetLargeArray();
hashSetLarge.add(1);
hashSetLarge.add(2);
console.log("描述:", hashSetLarge.contains(1)); // 期望结果: true
console.log("描述:", hashSetLarge.contains(3)); // 期望结果: false
hashSetLarge.remove(2);
console.log("描述:", hashSetLarge.contains(2)); // 期望结果: false

export {};
