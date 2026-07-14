// ============================================================
// 129. 设计哈希集合
// ============================================================
// LeetCode 705. Design HashSet
// 不使用内置哈希集合库，设计哈希集合，支持 add、contains、remove。
// 时间复杂度：平均 O(1)，空间复杂度：O(n)

// 思路：链地址法（separate chaining）
class MyHashSet {
  private size = 1009; // 桶数（质数，减少冲突）
  private buckets: number[][];

  constructor() {
    this.buckets = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.buckets[i] = [];
    }
  }

  private hash(key: number): number {
    return key % this.size;
  }

  add(key: number): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    if (!bucket.includes(key)) {
      bucket.push(key);
    }
  }

  remove(key: number): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const pos = bucket.indexOf(key);
    if (pos !== -1) {
      bucket.splice(pos, 1);
    }
  }

  contains(key: number): boolean {
    const idx = this.hash(key);
    return this.buckets[idx].includes(key);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 129. 设计哈希集合 =====");
const hashSet = new MyHashSet();
hashSet.add(1);
hashSet.add(2);
console.log(hashSet.contains(1)); // 期望: true
console.log(hashSet.contains(3)); // 期望: false
hashSet.add(2);
console.log(hashSet.contains(2)); // 期望: true
hashSet.remove(2);
console.log(hashSet.contains(2)); // 期望: false

export {};
