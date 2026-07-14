// ============================================================
// 084. 最大兼容性评分和
// ============================================================
// LeetCode 1947. Maximum Compatibility Score Sum
// 给定 students 和 mentors 的答案（每行 m 个 0/1），将每个学生分配给一个导师（一一对应），
// 最大化总兼容度（匹配答案数之和）。
// 时间复杂度：O(m! * m)（回溯）或 O(2^m * m^2)（状压DP）。

// 计算 popcount
function popcount84(x: number): number {
  let count: number = 0;
  while (x > 0) {
    count += x & 1;
    x >>= 1;
  }
  return count;
}

// 方法1：回溯(排列) (推荐)
// 将学生按顺序分配给不同导师，枚举所有排列。预计算兼容度矩阵加速。
// 剪枝：当前和 + 剩余理论最大 <= 最优时回溯。
// 时间复杂度：O(m! * m)，空间复杂度：O(m^2 + m)
function maxCompatibilitySum1(students: number[][], mentors: number[][]): number {
  const m: number = students.length;
  const n: number = students[0].length;

  // 预计算 score[i][j] = 学生 i 与导师 j 的兼容度
  const score: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < m; j++) {
      let s: number = 0;
      for (let k: number = 0; k < n; k++) {
        if (students[i][k] === mentors[j][k]) s++;
      }
      score[i][j] = s;
    }
  }

  const used: boolean[] = new Array(m).fill(false);
  let maxSum: number = 0;

  const backtrack = (studentIdx: number, currentSum: number): void => {
    if (studentIdx === m) {
      maxSum = Math.max(maxSum, currentSum);
      return;
    }
    // 剪枝：剩余理论最大也无法超过最优
    if (currentSum + (m - studentIdx) * n <= maxSum) return;

    for (let j: number = 0; j < m; j++) {
      if (used[j]) continue;
      used[j] = true;
      backtrack(studentIdx + 1, currentSum + score[studentIdx][j]);
      used[j] = false;
    }
  };

  backtrack(0, 0);
  return maxSum;
}

// 方法2：状态压缩DP
// dp[mask] 表示导师集合 mask 已分配给前 popcount(mask) 个学生时的最大兼容度。
// dp[mask] = max over j in mask: dp[mask ^ (1<<j)] + score[popcount(mask)-1][j]
// 时间复杂度：O(2^m * m)，空间复杂度：O(2^m + m^2)
function maxCompatibilitySum2(students: number[][], mentors: number[][]): number {
  const m: number = students.length;
  const n: number = students[0].length;

  // 预计算兼容度矩阵
  const score: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < m; j++) {
      let s: number = 0;
      for (let k: number = 0; k < n; k++) {
        if (students[i][k] === mentors[j][k]) s++;
      }
      score[i][j] = s;
    }
  }

  const dp: number[] = new Array(1 << m).fill(0);

  for (let mask: number = 1; mask < 1 << m; mask++) {
    const bits: number = popcount84(mask);
    const studentIdx: number = bits - 1; // 第 bits 个学生（0-indexed）
    for (let j: number = 0; j < m; j++) {
      if (!(mask & (1 << j))) continue;
      const prevMask: number = mask ^ (1 << j);
      dp[mask] = Math.max(dp[mask], dp[prevMask] + score[studentIdx][j]);
    }
  }

  return dp[(1 << m) - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 最大兼容性评分和 =====");
console.log(
  maxCompatibilitySum1(
    [
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 1],
    ],
    [
      [1, 0, 0],
      [0, 0, 1],
      [1, 1, 0],
    ],
  ),
); // 期望结果: 8
console.log(
  maxCompatibilitySum1(
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
  ),
); // 期望结果: 0
console.log(
  maxCompatibilitySum2(
    [
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 1],
    ],
    [
      [1, 0, 0],
      [0, 0, 1],
      [1, 1, 0],
    ],
  ),
); // 期望结果: 8
console.log(
  maxCompatibilitySum2(
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
  ),
); // 期望结果: 0
console.log(
  maxCompatibilitySum2(
    [
      [0, 1, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 0],
    ],
    [
      [1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 1, 1],
      [0, 1, 0, 0, 1, 1],
    ],
  ),
); // 期望结果: 10

export {};
