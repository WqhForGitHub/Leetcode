// ============================================================
// 093. 与目标颜色间的最短距离
// ============================================================
// LeetCode 1182. Shortest Distance to Target Color
// 颜色数组 colors（1,2,3），对每个查询返回最近的指定颜色距离。

// 方法1：预处理 + 二分查找
function shortestDistanceColor(
  colors: number[],
  queries: number[][]
): number[] {
  // pos[color] = color 出现的所有位置
  const pos: Map<number, number[]> = new Map();
  for (let i = 0; i < colors.length; i++) {
    if (!pos.has(colors[i])) pos.set(colors[i], []);
    pos.get(colors[i])!.push(i);
  }
  const result: number[] = [];
  for (const [index, color] of queries) {
    if (!pos.has(color)) {
      result.push(-1);
      continue;
    }
    const arr = pos.get(color)!;
    // 二分找最近的
    let lo = 0;
    let hi = arr.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < index) lo = mid + 1;
      else hi = mid;
    }
    let dist = Math.abs(arr[lo] - index);
    if (lo > 0) {
      dist = Math.min(dist, Math.abs(arr[lo - 1] - index));
    }
    result.push(dist);
  }
  return result;
}

// 方法2：双向预处理（O(n)）
function shortestDistanceColorDP(
  colors: number[],
  queries: number[][]
): number[] {
  const n = colors.length;
  const dist: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    dist[i] = [Infinity, Infinity, Infinity];
  }
  // 从左到右
  const last = [-1, -1, -1];
  for (let i = 0; i < n; i++) {
    last[colors[i] - 1] = i;
    for (let c = 0; c < 3; c++) {
      if (last[c] !== -1) {
        dist[i][c] = Math.min(dist[i][c], i - last[c]);
      }
    }
  }
  // 从右到左
  last.fill(-1);
  for (let i = n - 1; i >= 0; i--) {
    last[colors[i] - 1] = i;
    for (let c = 0; c < 3; c++) {
      if (last[c] !== -1) {
        dist[i][c] = Math.min(dist[i][c], last[c] - i);
      }
    }
  }
  const result: number[] = [];
  for (const [index, color] of queries) {
    const d = dist[index][color - 1];
    result.push(d === Infinity ? -1 : d);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 与目标颜色间的最短距离 =====");
console.log("二分 [1,1,2,1,3,2,2,3,3],:",
  shortestDistanceColor([1, 1, 2, 1, 3, 2, 2, 3, 3], [[1, 3], [2, 2], [6, 1]])); // [3,0,3]
console.log("DP [1,1,2,1,3,2,2,3,3],:",
  shortestDistanceColorDP([1, 1, 2, 1, 3, 2, 2, 3, 3], [[1, 3], [2, 2], [6, 1]])); // [3,0,3]

export {};
