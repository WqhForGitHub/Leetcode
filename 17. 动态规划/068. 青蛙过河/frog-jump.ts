// ============================================================
// 068. 青蛙过河
// ============================================================
// LeetCode 403. Frog Jump
// 给定石头位置数组，青蛙初始在第一块石头，每次跳跃距离为上次距离-1/0/+1，第一跳距离1，判断能否过河。
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)

// 方法1：动态规划（推荐）
// dp[stone] = 能到达该石头的所有可能跳跃距离的集合
// 状态转移：对于每个石头的每个跳跃距离 k，可以跳 k-1, k, k+1 到下一个石头
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function canCross(stones: number[]): boolean {
  const n: number = stones.length;
  if (n === 0) return false;
  // 第一块石头和第二块石头距离必须为1
  if (stones[1] - stones[0] !== 1) return false;

  // stone -> index 的映射，方便快速查找
  const stoneIndex: Map<number, number> = new Map();
  for (let i: number = 0; i < n; i++) {
    stoneIndex.set(stones[i], i);
  }

  // dp[i] = 能到达 stones[i] 的所有跳跃距离集合
  const dp: Set<number>[] = new Array(n);
  for (let i: number = 0; i < n; i++) {
    dp[i] = new Set<number>();
  }
  // 初始状态：在第一块石头，跳跃距离为0
  dp[0].add(0);

  for (let i: number = 0; i < n; i++) {
    for (const k of dp[i]) {
      // 从 stones[i] 出发，尝试跳跃 k-1, k, k+1
      for (let step: number = k - 1; step <= k + 1; step++) {
        if (step <= 0) continue; // 跳跃距离必须为正
        const nextPos: number = stones[i] + step;
        if (stoneIndex.has(nextPos)) {
          const nextIdx: number = stoneIndex.get(nextPos)!;
          dp[nextIdx].add(step);
        }
      }
    }
  }

  // 最后一块石头是否有可达的跳跃距离
  return dp[n - 1].size > 0;
}

// 方法2：递归 + 记忆化
// 从位置0跳跃距离0开始，递归尝试所有可能的跳跃
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function canCross2(stones: number[]): boolean {
  const n: number = stones.length;
  if (stones[1] - stones[0] !== 1) return false;

  const stoneIndex: Map<number, number> = new Map();
  for (let i: number = 0; i < n; i++) {
    stoneIndex.set(stones[i], i);
  }

  // memo: key = "index,k" 表示在 index 位置以跳跃距离 k 到达
  const memo: Set<string> = new Set();

  function dfs(index: number, k: number): boolean {
    if (index === n - 1) return true; // 到达最后一块石头

    const key: string = `${index},${k}`;
    if (memo.has(key)) return false; // 已访问过，避免重复
    memo.add(key);

    // 尝试跳跃 k-1, k, k+1
    for (let step: number = k + 1; step >= k - 1; step--) {
      if (step <= 0) continue;
      const nextPos: number = stones[index] + step;
      if (stoneIndex.has(nextPos)) {
        const nextIdx: number = stoneIndex.get(nextPos)!;
        if (dfs(nextIdx, step)) return true;
      }
    }

    return false;
  }

  return dfs(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 青蛙过河 =====");
console.log(canCross([0, 1, 3, 5, 6, 8, 12, 17])); // 期望结果: true
console.log(canCross([0, 1, 2, 3, 4, 8, 9, 11])); // 期望结果: false
console.log(canCross([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); // 期望结果: true

export {};
