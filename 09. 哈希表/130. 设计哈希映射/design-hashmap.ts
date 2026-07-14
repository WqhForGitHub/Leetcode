// ============================================================
// 130. 设计哈希映射
// ============================================================
// LeetCode 706. Design HashMap
// 不使用内置哈希映射库，设计哈希映射，支持 put、get、remove。
// 时间复杂度：平均 O(1)，空间复杂度：O(n)

// 思路：链地址法，每个桶存 [key, value] 对数组
class MyHashMap {
  private size = 1009;
  private buckets: [number, number][][];

  constructor() {
    this.buckets = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.buckets[i] = [];
    }
  }

  private hash(key: number): number {
    return key % this.size;
  }

  put(key: number, value: number): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value; // 更新
        return;
      }
    }
    bucket.push([key, value]); // 新增
  }

  get(key: number): number {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    for (const pair of bucket) {
      if (pair[0] === key) return pair[1];
    }
    return -1;
  }

  remove(key: number): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return;
      }
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 130. 设计哈希映射 =====");
const hashMap = new MyHashMap();
hashMap.put(1, 1);
hashMap.put(2, 2);
console.log(hashMap.get(1)); // 期望: 1
console.log(hashMap.get(3)); // 期望: -1
hashMap.put(2, 1); // 更新
console.log(hashMap.get(2)); // 期望: 1
hashMap.remove(2);
console.log(hashMap.get(2)); // 期望: -1

export {};
