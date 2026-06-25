// ============================================================
// 55. 设计哈希映射
// ============================================================
// LeetCode 706. Design HashMap
// 不使用内建哈希库，设计一个哈希映射。
// 包含 put(key, value)、get(key)、remove(key) 方法。
// 时间复杂度：O(1) 均摊，空间复杂度：O(n)

// 键值对节点：用于链地址法中桶内的链表
class Pair {
  key: number;
  value: number;
  next: Pair | null;
  constructor(key: number, value: number, next: Pair | null = null) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}

// 方法1：链地址法-数组+链表（推荐）
// 桶数组 + 每个桶用单链表存储冲突键值对
class MyHashMap {
  private buckets: (Pair | null)[];
  private size: number;

  constructor() {
    this.size = 1009; // 取质数减少冲突
    this.buckets = new Array(this.size).fill(null);
  }

  private hash(key: number): number {
    return key % this.size;
  }

  put(key: number, value: number): void {
    const idx = this.hash(key);
    if (this.buckets[idx] === null) {
      this.buckets[idx] = new Pair(key, value);
      return;
    }
    let cur: Pair | null = this.buckets[idx];
    while (cur !== null) {
      if (cur.key === key) {
        cur.value = value; // 已存在则更新
        return;
      }
      if (cur.next === null) {
        cur.next = new Pair(key, value);
        return;
      }
      cur = cur.next;
    }
  }

  get(key: number): number {
    const idx = this.hash(key);
    let cur: Pair | null = this.buckets[idx];
    while (cur !== null) {
      if (cur.key === key) return cur.value;
      cur = cur.next;
    }
    return -1; // 不存在返回 -1
  }

  remove(key: number): void {
    const idx = this.hash(key);
    const head = this.buckets[idx];
    if (head === null) return;

    if (head.key === key) {
      this.buckets[idx] = head.next;
      return;
    }
    let cur: Pair | null = head;
    while (cur !== null && cur.next !== null) {
      if (cur.next.key === key) {
        cur.next = cur.next.next;
        return;
      }
      cur = cur.next;
    }
  }
}

// 方法2：大数组直接映射
// key 范围有限时，用一个大数组直接存 value，空间消耗大但实现极简
class MyHashMapLargeArray {
  private data: number[];

  constructor() {
    this.data = new Array(1000001).fill(-1);
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

// ============================================================
// 测试
// ============================================================
console.log("===== 55. 设计哈希映射 =====");
const hashMap = new MyHashMap();
hashMap.put(1, 1);
hashMap.put(2, 2);
console.log("描述:", hashMap.get(1)); // 期望结果: 1
console.log("描述:", hashMap.get(3)); // 期望结果: -1
hashMap.put(2, 1); // 更新 key=2 的值
console.log("描述:", hashMap.get(2)); // 期望结果: 1
hashMap.remove(2);
console.log("描述:", hashMap.get(2)); // 期望结果: -1

const hashMapLarge = new MyHashMapLargeArray();
hashMapLarge.put(1, 1);
hashMapLarge.put(2, 2);
console.log("描述:", hashMapLarge.get(1)); // 期望结果: 1
console.log("描述:", hashMapLarge.get(3)); // 期望结果: -1
hashMapLarge.put(2, 1);
console.log("描述:", hashMapLarge.get(2)); // 期望结果: 1
hashMapLarge.remove(2);
console.log("描述:", hashMapLarge.get(2)); // 期望结果: -1

export {};
