// ============================================================
// 079. 完成所有工作的最短时间
// ============================================================
// LeetCode 1723. Find Minimum Time to Finish All Jobs
// 给定 jobs（每个工作的处理时间）和 k 个工人，将工作分配给工人，
// 最小化"最大工人的总工作时间"。
// 时间复杂度：见各方法。

// 方法1：回溯+二分 (推荐)
// 二分答案 limit，用回溯判断能否将所有工作分配给 k 个工人且每人不超过 limit。
// 回溯中按工作时长降序处理，并对空闲工人做对称性剪枝。
// 时间复杂度：O(log(sum) * k^n)，空间复杂度：O(n + k)
function minimumTimeRequired1(jobs: number[], k: number): number {
  const sortedJobs: number[] = [...jobs].sort((a: number, b: number) => b - a);
  let lo: number = sortedJobs[0];
  let hi: number = sortedJobs.reduce((a: number, b: number) => a + b, 0);

  // 判断在 limit 限制下能否分配
  const canAssign = (limit: number): boolean => {
    const loads: number[] = new Array(k).fill(0);
    const backtrack = (idx: number): boolean => {
      if (idx === sortedJobs.length) return true;
      for (let i: number = 0; i < k; i++) {
        if (loads[i] + sortedJobs[idx] <= limit) {
          loads[i] += sortedJobs[idx];
          if (backtrack(idx + 1)) return true;
          loads[i] -= sortedJobs[idx];
        }
        // 对称性剪枝：若该工人当前负载为 0，说明此工作放谁都一样，无需再试
        if (loads[i] === 0) break;
      }
      return false;
    };
    return backtrack(0);
  };

  while (lo < hi) {
    const mid: number = Math.floor((lo + hi) / 2);
    if (canAssign(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// 方法2：回溯+剪枝+排序
// 按工作时长降序分配，维护每个工人的负载和当前最大负载。
// 剪枝：当前最大 >= 已知最优时回溯；相同负载的工人只试第一个（对称性）。
// 时间复杂度：最坏 O(k^n)，剪枝后很快，空间复杂度：O(n + k)
function minimumTimeRequired2(jobs: number[], k: number): number {
  const sortedJobs: number[] = [...jobs].sort((a: number, b: number) => b - a);
  const loads: number[] = new Array(k).fill(0);
  let best: number = sortedJobs.reduce((a: number, b: number) => a + b, 0);

  const backtrack = (idx: number, currentMax: number): void => {
    if (idx === sortedJobs.length) {
      best = Math.min(best, currentMax);
      return;
    }
    // 剪枝：当前最大已超过最优
    if (currentMax >= best) return;

    for (let i: number = 0; i < k; i++) {
      // 剪枝：加上该工作后超过最优则跳过
      if (loads[i] + sortedJobs[idx] >= best) continue;
      // 对称性剪枝：跳过与之前工人负载相同的情况
      let skip: boolean = false;
      for (let j: number = 0; j < i; j++) {
        if (loads[j] === loads[i]) {
          skip = true;
          break;
        }
      }
      if (skip) continue;

      loads[i] += sortedJobs[idx];
      backtrack(idx + 1, Math.max(currentMax, loads[i]));
      loads[i] -= sortedJobs[idx];
    }
  };

  backtrack(0, 0);
  return best;
}

// 方法3：状态压缩DP
// dp[mask] 表示已分配的工作集合为 mask 时，最大工人负载的最小值。
// 每个工人选一个子集 sub，dp[mask|sub] = min(..., max(dp[mask], total[sub]))。
// 迭代 k 轮（每个工人一轮）。
// 时间复杂度：O(k * 3^n)，空间复杂度：O(2^n)
function minimumTimeRequired3(jobs: number[], k: number): number {
  const n: number = jobs.length;
  const fullMask: number = (1 << n) - 1;

  // 预计算每个子集的工作时间之和
  const total: number[] = new Array(1 << n).fill(0);
  for (let mask: number = 0; mask < 1 << n; mask++) {
    for (let i: number = 0; i < n; i++) {
      if (mask & (1 << i)) total[mask] += jobs[i];
    }
  }

  let dp: number[] = new Array(1 << n).fill(Infinity);
  dp[0] = 0;

  for (let worker: number = 0; worker < k; worker++) {
    const newDp: number[] = new Array(1 << n).fill(Infinity);
    for (let mask: number = 0; mask < 1 << n; mask++) {
      if (dp[mask] === Infinity) continue;
      // 不给当前工人分配工作
      if (dp[mask] < newDp[mask]) newDp[mask] = dp[mask];
      // 给当前工人分配子集 sub
      const remaining: number = fullMask ^ mask;
      for (let sub: number = remaining; sub > 0; sub = (sub - 1) & remaining) {
        const newMask: number = mask | sub;
        const newMax: number = Math.max(dp[mask], total[sub]);
        if (newMax < newDp[newMask]) newDp[newMask] = newMax;
      }
    }
    dp = newDp;
  }

  return dp[fullMask];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 完成所有工作的最短时间 =====");
console.log(minimumTimeRequired1([3, 2, 3], 3)); // 期望结果: 3
console.log(minimumTimeRequired1([1, 2, 4, 7, 8], 2)); // 期望结果: 11
console.log(minimumTimeRequired2([3, 2, 3], 3)); // 期望结果: 3
console.log(minimumTimeRequired2([1, 2, 4, 7, 8], 2)); // 期望结果: 11
console.log(minimumTimeRequired3([3, 2, 3], 3)); // 期望结果: 3
console.log(minimumTimeRequired3([1, 2, 4, 7, 8], 2)); // 期望结果: 11

export {};
