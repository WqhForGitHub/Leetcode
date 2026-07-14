// ============================================================
// 097. 公平分发饼干
// ============================================================
// LeetCode 2305. Fair Distribution of Cookies
// 给定 cookies 数组和 k 个孩子，将所有饼干包分给 k 个孩子，
// 使"不公平度"（任意孩子获得的饼干总数最大值）最小。
// 时间复杂度：O(k^n), 空间复杂度：O(k + n)

// 方法1：回溯+剪枝 (推荐)
// 对每包饼干，尝试分给每个孩子；若某孩子加上后超过当前最优则剪枝。
// 利用"空孩子等价"剪枝：第一个空孩子之后无需再尝试。
// 时间复杂度 O(k^n) 最坏, 空间复杂度 O(k + n)
function distributeCookies(cookies: number[], k: number): number {
  const n: number = cookies.length;
  let answer: number = Infinity;
  const childSum: number[] = new Array(k).fill(0);

  const backtrack = (idx: number): void => {
    if (idx === n) {
      let mx: number = 0;
      for (let i = 0; i < k; i++) mx = Math.max(mx, childSum[i]);
      answer = Math.min(answer, mx);
      return;
    }
    for (let i = 0; i < k; i++) {
      // 剪枝：加上后若已超过当前最优，则跳过
      if (childSum[i] + cookies[idx] >= answer) continue;
      childSum[i] += cookies[idx];
      backtrack(idx + 1);
      childSum[i] -= cookies[idx];
      // 空孩子等价剪枝：若该孩子此前为空，则后续空孩子情况相同，无需重复
      if (childSum[i] === 0) break;
    }
  };

  backtrack(0);
  return answer;
}

// 方法2：状态压缩 DP
// dp[mask] = 将 mask 表示的饼干包分给"若干孩子"时的最小不公平度。
// 为追踪孩子数，使用 (k_used, maxSum) 复合状态，等价于：
// dp[mask][j] = 前 j 个孩子分配 mask 的最小不公平度。
// 转移：dp[mask][j] = min_{sub ⊆ mask, sub != 0} max(sum[sub], dp[mask\sub][j-1])
// 时间复杂度 O(3^n * k), 空间复杂度 O(2^n * k)
function distributeCookies2(cookies: number[], k: number): number {
  const n: number = cookies.length;
  const total: number = 1 << n;
  // 预处理每个子集的饼干总和
  const sum: number[] = new Array(total).fill(0);
  for (let mask = 0; mask < total; mask++) {
    let s: number = 0;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) s += cookies[i];
    }
    sum[mask] = s;
  }

  // dp[j][mask] = 用前 j 个孩子分配 mask 的最小不公平度
  // 滚动数组：只用上一行
  let prev: number[] = new Array(total).fill(Infinity);
  prev[0] = 0;
  for (let j = 1; j <= k; j++) {
    const cur: number[] = new Array(total).fill(Infinity);
    cur[0] = 0;
    for (let mask = 1; mask < total; mask++) {
      // 枚举 mask 的非空子集 sub 作为第 j 个孩子分到的饼干
      let sub: number = mask;
      while (sub > 0) {
        const rest: number = mask ^ sub;
        if (prev[rest] !== Infinity) {
          const val: number = Math.max(sum[sub], prev[rest]);
          if (val < cur[mask]) cur[mask] = val;
        }
        sub = (sub - 1) & mask;
      }
    }
    prev = cur;
  }
  return prev[total - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 公平分发饼干 =====");
// 注：[8,15,10,20,8] 总和为 61，理论最小不公平度为 31（[8,15,8] 与 [10,20]）
console.log(distributeCookies([8, 15, 10, 20, 8], 2)); // 期望结果: 31
console.log(distributeCookies2([8, 15, 10, 20, 8], 2)); // 期望结果: 31
console.log(distributeCookies([6, 1, 3, 2, 2, 4, 1, 2], 3)); // 期望结果: 7
console.log(distributeCookies2([6, 1, 3, 2, 2, 4, 1, 2], 3)); // 期望结果: 7

export {};
