// ============================================================
// 172. 区间内查询数字的频率
// ============================================================
// LeetCode 2080. Range Frequency Queries
// 给定数组，多次查询 [left, right] 中 value 出现的次数。

// 方法1：哈希表 + 二分查找
class RangeFreqQuery {
  private map: Map<number, number[]>;

  constructor(arr: number[]) {
    this.map = new Map();
    for (let i = 0; i < arr.length; i++) {
      if (!this.map.has(arr[i])) this.map.set(arr[i], []);
      this.map.get(arr[i])!.push(i);
    }
  }

  query(left: number, right: number, value: number): number {
    if (!this.map.has(value)) return 0;
    const indices = this.map.get(value)!;
    // 二分找第一个 >= left 的位置
    let lo = 0;
    let hi = indices.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (indices[mid] < left) lo = mid + 1;
      else hi = mid;
    }
    const start = lo;
    // 二分找第一个 > right 的位置
    lo = 0;
    hi = indices.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (indices[mid] <= right) lo = mid + 1;
      else hi = mid;
    }
    const end = lo;
    return end - start;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 172. 区间内查询数字的频率 =====");
const rfq = new RangeFreqQuery([12, 33, 4, 56, 22, 2, 34, 33, 22, 12, 34, 56]);
console.log("query(1,2,4):", rfq.query(1, 2, 4)); // 1
console.log("query(0,11,33):", rfq.query(0, 11, 33)); // 2
console.log("query(2,5,22):", rfq.query(2, 5, 22)); // 1

export {};
