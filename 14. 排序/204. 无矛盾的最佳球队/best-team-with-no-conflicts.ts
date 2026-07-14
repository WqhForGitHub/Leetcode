// ============================================================
// 204. 无矛盾的最佳球队
// ============================================================
// LeetCode 1626. Best Team With No Conflicts
// 给定 scores 和 ages 数组。选一支球队，要求无冲突：
// 较年轻的球员不能有严格高于较年长球员的分数。最大化球队总分。

// 方法1：按年龄排序再按分数排序 + 分数LIS动态规划（O(n^2)）
function bestTeamScore(scores: number[], ages: number[]): number {
  const n = scores.length;
  const players = scores.map((s, i) => ({ score: s, age: ages[i] }));
  // 按年龄升序，年龄相同按分数升序
  players.sort((a, b) => a.age - b.age || a.score - b.score);

  const dp = new Array(n).fill(0);
  let max = 0;
  for (let i = 0; i < n; i++) {
    dp[i] = players[i].score;
    for (let j = 0; j < i; j++) {
      // j 排在 i 前面，年龄 <= i 的年龄
      // 要求分数 j <= 分数 i 才能无冲突加入
      if (players[j].score <= players[i].score) {
        dp[i] = Math.max(dp[i], dp[j] + players[i].score);
      }
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}

// 方法2：按分数排序再按年龄排序 + 年龄LIS动态规划（O(n^2)）
function bestTeamScore2(scores: number[], ages: number[]): number {
  const n = scores.length;
  const players = scores.map((s, i) => ({ score: s, age: ages[i] }));
  // 按分数升序，分数相同按年龄升序
  players.sort((a, b) => a.score - b.score || a.age - b.age);

  const dp = new Array(n).fill(0);
  let max = 0;
  for (let i = 0; i < n; i++) {
    dp[i] = players[i].score;
    for (let j = 0; j < i; j++) {
      // j 排在 i 前面，分数 <= i 的分数
      // 要求年龄 j <= 年龄 i 才能无冲突加入（避免年轻球员分数更高）
      if (players[j].age <= players[i].age) {
        dp[i] = Math.max(dp[i], dp[j] + players[i].score);
      }
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 204. 无矛盾的最佳球队 =====");
console.log(
  "方法1 scores=[1,3,5,10,15] ages=[1,2,3,4,5]:",
  bestTeamScore([1, 3, 5, 10, 15], [1, 2, 3, 4, 5]),
);
console.log(
  "方法2 scores=[1,3,5,10,15] ages=[1,2,3,4,5]:",
  bestTeamScore2([1, 3, 5, 10, 15], [1, 2, 3, 4, 5]),
);
console.log("方法1 scores=[4,5,6,5] ages=[2,1,2,1]:", bestTeamScore([4, 5, 6, 5], [2, 1, 2, 1]));
console.log("方法2 scores=[4,5,6,5] ages=[2,1,2,1]:", bestTeamScore2([4, 5, 6, 5], [2, 1, 2, 1]));
console.log("方法1 scores=[1,2,3,5] ages=[8,9,10,1]:", bestTeamScore([1, 2, 3, 5], [8, 9, 10, 1]));
console.log("方法2 scores=[1,2,3,5] ages=[8,9,10,1]:", bestTeamScore2([1, 2, 3, 5], [8, 9, 10, 1]));

export {};
