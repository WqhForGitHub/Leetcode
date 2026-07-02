// ============================================================
// 194. 两球之间的磁力
// ============================================================
// LeetCode 1552. Magnetic Force Between Two Balls
// 给定位置数组 position 和球数 m，将 m 个球放入这些位置，
// 最大化任意两球之间的最小距离。

// 方法1：排序 + 二分答案 + 贪心放置（O(n log n + n log D)）
function maxDistance(position: number[], m: number): number {
  const sorted = [...position].sort((a, b) => a - b);
  const n = sorted.length;

  // 判断能否以最小间距 d 放下 m 个球
  const canPlace = (d: number): boolean => {
    let count = 1;
    let prev = sorted[0];
    for (let i = 1; i < n; i++) {
      if (sorted[i] - prev >= d) {
        count++;
        prev = sorted[i];
        if (count >= m) return true;
      }
    }
    return count >= m;
  };

  let lo = 1;
  let hi = sorted[n - 1] - sorted[0];
  let answer = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canPlace(mid)) {
      answer = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return answer;
}

// 方法2：排序 + 二分答案（内联贪心检查）（O(n log n + n log D)）
// 思路一致，将贪心检查内联进二分主体，代码更紧凑。
function maxDistance2(position: number[], m: number): number {
  const sorted = [...position].sort((a, b) => a - b);
  const n = sorted.length;
  let lo = 1;
  let hi = sorted[n - 1] - sorted[0];
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    // 内联：以间距 mid 贪心放置，统计可放球数
    let count = 1;
    let prev = sorted[0];
    for (let i = 1; i < n && count < m; i++) {
      if (sorted[i] - prev >= mid) {
        count++;
        prev = sorted[i];
      }
    }
    if (count >= m) {
      lo = mid + 1; // 可行，尝试更大间距
    } else {
      hi = mid - 1;
    }
  }
  return hi;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 194. 两球之间的磁力 =====");
console.log("方法1 [1,2,3,4,7], m=3:", maxDistance([1, 2, 3, 4, 7], 3)); // 3
console.log("方法1 [5,4,3,2,1,1000000000], m=2:", maxDistance([5, 4, 3, 2, 1, 1000000000], 2)); // 999999999
console.log("方法2 [1,2,3,4,7], m=3:", maxDistance2([1, 2, 3, 4, 7], 3)); // 3
console.log("方法2 [5,4,3,2,1,1000000000], m=2:", maxDistance2([5, 4, 3, 2, 1, 1000000000], 2)); // 999999999

export {};
