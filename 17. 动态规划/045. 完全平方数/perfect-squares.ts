// ============================================================
// 045. 完全平方数
// ============================================================
// LeetCode 279. Perfect Squares
// 给定正整数 n，返回和为 n 的最少完全平方数个数。
// 时间复杂度 O(n*sqrt(n))，空间复杂度 O(n)

// 方法1：动态规划（推荐）
// dp[i] 表示和为 i 的最少完全平方数个数
// 状态转移：dp[i] = min(dp[i - j*j] + 1) for all j where j*j <= i
// 时间复杂度 O(n*sqrt(n))，空间复杂度 O(n)
function numSquares(n: number): number {
  // dp[i] 表示组成 i 的最少完全平方数个数
  const dp: number[] = new Array<number>(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i: number = 1; i <= n; i++) {
    // 遍历所有小于等于 i 的完全平方数 j*j
    for (let j: number = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }

  return dp[n];
}

// 方法2：BFS 广度优先搜索
// 将问题转化为图的最短路径：从 n 出发，每次减去一个完全平方数，到达0的最少步数
// 时间复杂度 O(n*sqrt(n))，空间复杂度 O(n)
function numSquares2(n: number): number {
  // 预计算所有不超过 n 的完全平方数
  const squares: number[] = [];
  for (let j: number = 1; j * j <= n; j++) {
    squares.push(j * j);
  }

  // BFS
  const queue: number[] = [n];
  const visited: Set<number> = new Set<number>([n]);
  let level: number = 0;

  while (queue.length > 0) {
    const size: number = queue.length;
    level++;
    for (let i: number = 0; i < size; i++) {
      const curr: number = queue.shift()!;
      if (curr === 0) return level - 1;
      for (const sq of squares) {
        const next: number = curr - sq;
        if (next === 0) return level;
        if (next > 0 && !visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  }

  return n;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 完全平方数 =====");
console.log(numSquares(12)); // 期望结果: 3 (4+4+4)
console.log(numSquares(13)); // 期望结果: 2 (4+9)
console.log(numSquares(1)); // 期望结果: 1
console.log(numSquares(4)); // 期望结果: 1
console.log(numSquares2(12)); // 期望结果: 3

export {};
