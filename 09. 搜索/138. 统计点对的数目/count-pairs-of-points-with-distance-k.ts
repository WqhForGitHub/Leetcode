// ============================================================
// 138. 统计点对的数目
// ============================================================
// LeetCode 1782. Count Pairs Of Points With Distance k
// 统计满足 |x1-x2| + |y1-y2| = k 的点对数。

// 方法1：哈希表 + 枚举
function countPairs1782(
  coordinates: number[][],
  k: number
): number {
  const n = coordinates.length;
  const map = new Map<string, number>();
  let count = 0;
  for (const [x, y] of coordinates) {
    // 枚举 dx 从 0 到 k，dy = k - dx
    for (let dx = 0; dx <= k; dx++) {
      const dy = k - dx;
      // 目标点可能是 (x+dx, y+dy), (x+dx, y-dy), (x-dx, y+dy), (x-dx, y-dy)
      const targets = [
        [x + dx, y + dy],
        [x + dx, y - dy],
        [x - dx, y + dy],
        [x - dx, y - dy],
      ];
      for (const [tx, ty] of targets) {
        const key = `${tx},${ty}`;
        if (map.has(key)) {
          count += map.get(key)!;
        }
      }
    }
    const key = `${x},${y}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return count;
}

// 方法2：暴力双重循环（O(n²)）
function countPairs1782Brute(
  coordinates: number[][],
  k: number
): number {
  const n = coordinates.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dist =
        Math.abs(coordinates[i][0] - coordinates[j][0]) +
        Math.abs(coordinates[i][1] - coordinates[j][1]);
      if (dist === k) count++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 138. 统计点对的数目 =====");
console.log("哈希 [[1,2],[4,2],[1,3],[5,2]],5:", countPairs1782([[1, 2], [4, 2], [1, 3], [5, 2]], 5)); // 2
console.log("暴力 [[1,3],[1,3],[1,3],[1,3],[1,3]],0:", countPairs1782Brute([[1, 3], [1, 3], [1, 3], [1, 3], [1, 3]], 0)); // 10

export {};
