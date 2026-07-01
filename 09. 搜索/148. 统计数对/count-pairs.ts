// ============================================================
// 148. 统计数对
// ============================================================
// LeetCode 1889. Minimum Space Wasted From Packaging
// 统计满足条件的数对数量。

// 方法1：排序 + 二分查找
function countPairs1889(
  packages: number[],
  boxes: number[][]
): number {
  const mod = 1_000_000_007;
  packages.sort((a, b) => a - b);
  const n = packages.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + packages[i];
  let result = Infinity;
  for (const supplierBoxes of boxes) {
    supplierBoxes.sort((a, b) => a - b);
    let waste = 0;
    let prev = 0;
    let possible = true;
    for (const boxSize of supplierBoxes) {
      // 找 packages 中 <= boxSize 的最大索引
      let lo = prev;
      let hi = n - 1;
      let best = prev - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (packages[mid] <= boxSize) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (best >= prev) {
        waste += boxSize * (best - prev + 1) - (prefix[best + 1] - prefix[prev]);
        prev = best + 1;
      }
    }
    if (prev === n) {
      result = Math.min(result, waste);
    }
  }
  return result === Infinity ? -1 : result % mod;
}

// 方法2：暴力
function countPairs1889Brute(
  packages: number[],
  boxes: number[][]
): number {
  const mod = 1_000_000_007;
  let result = Infinity;
  for (const supplierBoxes of boxes) {
    let waste = 0;
    let possible = true;
    for (const p of packages) {
      let minBox = Infinity;
      for (const b of supplierBoxes) {
        if (b >= p) {
          minBox = Math.min(minBox, b);
          break;
        }
      }
      if (minBox === Infinity) {
        possible = false;
        break;
      }
      waste += minBox - p;
    }
    if (possible) {
      result = Math.min(result, waste);
    }
  }
  return result === Infinity ? -1 : result % mod;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 148. 统计数对 =====");
console.log("二分 [2,3,5],[[4,8],[2,8]]:",
  countPairs1889([2, 3, 5], [[4, 8], [2, 8]])); // 6
console.log("二分 [3,5,8,10,11,12],[[12],[11,9],[10,5,14]]:",
  countPairs1889([3, 5, 8, 10, 11, 12], [[12], [11, 9], [10, 5, 14]])); // 9

export {};
