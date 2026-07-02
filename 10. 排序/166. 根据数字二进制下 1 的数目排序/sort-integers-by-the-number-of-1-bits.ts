// ============================================================
// 166. 根据数字二进制下 1 的数目排序
// ============================================================
// LeetCode 1356. Sort Integers by The Number of 1 Bits
// 给定整数数组，按二进制中 1 的个数升序排序，个数相同时按数值升序排序。

// 方法1：自定义比较函数排序（O(n log n * log W)）
function sortByBits1(arr: number[]): number[] {
  const popcount = (x: number): number => {
    let c = 0;
    while (x) {
      x &= x - 1;
      c++;
    }
    return c;
  };
  return [...arr].sort((a, b) => popcount(a) - popcount(b) || a - b);
}

// 方法2：按 1 的个数分桶排序（O(n log n)）
function sortByBits2(arr: number[]): number[] {
  const popcount = (x: number): number => {
    let c = 0;
    while (x) {
      x &= x - 1;
      c++;
    }
    return c;
  };
  const buckets: number[][] = [];
  for (const v of arr) {
    const c = popcount(v);
    if (!buckets[c]) buckets[c] = [];
    buckets[c].push(v);
  }
  const res: number[] = [];
  for (const b of buckets) {
    if (b) {
      b.sort((a, x) => a - x);
      res.push(...b);
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 166. 根据数字二进制下 1 的数目排序 =====");
console.log("方法1:", sortByBits1([0, 1, 2, 3, 4, 5, 6, 7, 8])); // [0,1,2,4,8,3,5,6,7]
console.log("方法2:", sortByBits2([0, 1, 2, 3, 4, 5, 6, 7, 8])); // [0,1,2,4,8,3,5,6,7]
console.log("方法1:", sortByBits1([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1]));
console.log("方法2:", sortByBits2([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1]));

export {};
