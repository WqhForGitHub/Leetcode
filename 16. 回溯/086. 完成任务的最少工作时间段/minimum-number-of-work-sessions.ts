// ============================================================
// 086. 完成任务的最少工作时间段
// ============================================================
// LeetCode 1986. Minimum Number of Work Sessions to Finish the Tasks
// 给定任务时长数组 tasks 和每个工作时段的最大时长 sessionTime，
// 求完成所有任务所需的最少工作时段数（每个时段内任务总时长 <= sessionTime）。
// 时间复杂度：O(3^n) 回溯, 空间复杂度：O(n)

// 方法1：回溯+二分 (推荐)
// 对答案（时段数）二分，回溯判定是否能在 mid 个时段内完成所有任务。
// 时间复杂度 O(log n * n * 上界分支), 空间复杂度 O(n)
function minSessions(tasks: number[], sessionTime: number): number {
  const n: number = tasks.length;
  // sessions[i] 表示第 i 个工作时段已用时间
  let sessions: number[] = [];

  // 检查能否用 limit 个时段完成任务
  const canFinish = (limit: number): boolean => {
    sessions = new Array(limit).fill(0);
    return backtrack(0);
  };

  const backtrack = (idx: number): boolean => {
    if (idx === n) return true;
    const cur: number = tasks[idx];
    // 尝试放入每个已有时段
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i] + cur <= sessionTime) {
        sessions[i] += cur;
        if (backtrack(idx + 1)) return true;
        sessions[i] -= cur;
      }
      // 剪枝：若该时段为空仍无法放入，则后续尝试也无意义
      if (sessions[i] === 0) break;
    }
    return false;
  };

  // 二分最少时段数
  let left: number = 1;
  let right: number = n;
  while (left < right) {
    const mid: number = (left + right) >> 1;
    if (canFinish(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// 方法2：状态压缩 DP
// dp[mask] = 完成任务集合 mask 所需最少时段数；
// remainder[mask] = 在该最少时段数下，最后一个时段剩余的可用时间（尽量大）。
// 时间复杂度 O(3^n), 空间复杂度 O(2^n)
function minSessions2(tasks: number[], sessionTime: number): number {
  const n: number = tasks.length;
  const total: number = 1 << n;
  const dp: number[] = new Array(total).fill(Infinity);
  const remainder: number[] = new Array(total).fill(-1);
  dp[0] = 1;
  remainder[0] = sessionTime;

  for (let mask = 0; mask < total; mask++) {
    if (dp[mask] === Infinity) continue;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) continue;
      const next: number = mask | (1 << i);
      const t: number = tasks[i];
      // 若当前最后一个时段还能放下任务 i
      if (remainder[mask] >= t) {
        // 同样时段数，剩余时间越大越好
        if (
          dp[mask] < dp[next] ||
          (dp[mask] === dp[next] && remainder[mask] - t > remainder[next])
        ) {
          dp[next] = dp[mask];
          remainder[next] = remainder[mask] - t;
        }
      } else {
        // 需要开新时段
        if (
          dp[mask] + 1 < dp[next] ||
          (dp[mask] + 1 === dp[next] && sessionTime - t > remainder[next])
        ) {
          dp[next] = dp[mask] + 1;
          remainder[next] = sessionTime - t;
        }
      }
    }
  }
  return dp[total - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 完成任务的最少工作时间段 =====");
console.log(minSessions([1, 2, 3], 3)); // 期望结果: 2
console.log(minSessions2([1, 2, 3], 3)); // 期望结果: 2
console.log(minSessions([3, 1, 3, 1, 1], 8)); // 期望结果: 2
console.log(minSessions2([3, 1, 3, 1, 1], 8)); // 期望结果: 2

export {};
