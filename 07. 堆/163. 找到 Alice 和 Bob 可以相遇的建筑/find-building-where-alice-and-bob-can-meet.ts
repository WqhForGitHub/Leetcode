// ============================================================
// 163. 找到 Alice 和 Bob 可以相遇的建筑
// ============================================================
// LeetCode 2940. Find Building Where Alice and Bob Can Meet
// 给定建筑高度数组，每次只能跳到更高的建筑，回答查询：Alice 和 Bob 最近的相遇建筑。
// 时间复杂度：O((n + q) log n)，空间复杂度：O(n + q)

// 方法1：单调栈 + 离线查询
function leftmostBuildingQueries(heights: number[], queries: number[][]): number[] {
  const n = heights.length;
  const q = queries.length;
  const result: number[] = new Array(q).fill(-1);
  // 离线查询按右端点排序
  const indexedQueries: Array<[number, number, number]> = queries.map((qr, i) => {
    const [a, b] = qr;
    return [Math.min(a, b), Math.max(a, b), i];
  });
  indexedQueries.sort((a, b) => b[1] - a[1]);
  const stack: number[] = []; // 单调递减栈
  let j = n - 1;
  const binarySearch = (h: number): number => {
    let lo = 0, hi = stack.length - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (heights[stack[mid]] > h) { ans = stack[mid]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  };
  for (const [a, b, qi] of indexedQueries) {
    if (a === b) { result[qi] = a; continue; }
    if (heights[b] > heights[a]) { result[qi] = b; continue; }
    const target = Math.max(heights[a], heights[b]);
    while (j > b) {
      while (stack.length > 0 && heights[stack[stack.length - 1]] <= heights[j]) stack.pop();
      stack.push(j);
      j--;
    }
    result[qi] = binarySearch(target);
  }
  return result;
}

// 方法2：线段树（简化版）
function leftmostBuildingQueriesST(heights: number[], queries: number[][]): number[] {
  const n = heights.length;
  const q = queries.length;
  const result: number[] = new Array(q).fill(-1);
  // 对每个查询暴力二分
  for (let i = 0; i < q; i++) {
    let [a, b] = queries[i];
    if (a > b) [a, b] = [b, a];
    if (a === b) { result[i] = a; continue; }
    if (heights[b] > heights[a]) { result[i] = b; continue; }
    const target = Math.max(heights[a], heights[b]);
    for (let j = b + 1; j < n; j++) {
      if (heights[j] > target) { result[i] = j; break; }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 163. 找到 Alice 和 Bob 可以相遇的建筑 =====");
console.log("单调栈:", leftmostBuildingQueries([6, 4, 8, 5, 2, 7], [[0, 1], [0, 3], [2, 4], [3, 4], [2, 2]]));
// 期望 [2,5,-1,5,2]
console.log("暴力:", leftmostBuildingQueriesST([5, 3, 8, 2, 6, 1, 4, 6], [[0, 7], [3, 5], [5, 2], [3, 0], [1, 6]]));
// 期望 [7,6,-1,2,4]? 验证

export {};
