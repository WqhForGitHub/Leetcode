// ============================================================
// 037. 找到小镇的法官
// ============================================================
// LeetCode 997. Find the Town Judge
// n 个人，trust=[[a,b]] 表示 a 信任 b。法官被所有人信任（除自己）且不信任任何人。
// 返回法官编号，不存在则返回 -1。
// 时间复杂度：O(n + T)，空间复杂度：O(n)，T 为 trust 条数

// 方法1：入度-出度统计（推荐）
// 思路：法官入度 = n-1（被所有人信任），出度 = 0（不信任任何人）。
// 用一个数组 net[i] = 入度 - 出度，法官满足 net[i] = n-1。
function findJudgeNet(n: number, trust: number[][]): number {
  const net = new Array(n + 1).fill(0);
  for (const [a, b] of trust) {
    net[a]--; // a 信任别人，出度+1
    net[b]++; // b 被信任，入度+1
  }
  for (let i = 1; i <= n; i++) {
    if (net[i] === n - 1) return i;
  }
  return -1;
}

// 方法2：双数组（入度 / 出度）
// 思路：分别记录每个人的入度与出度，法官满足入度=n-1 且出度=0。
function findJudgeDegree(n: number, trust: number[][]): number {
  const indegree = new Array(n + 1).fill(0);
  const outdegree = new Array(n + 1).fill(0);
  for (const [a, b] of trust) {
    outdegree[a]++;
    indegree[b]++;
  }
  for (let i = 1; i <= n; i++) {
    if (indegree[i] === n - 1 && outdegree[i] === 0) return i;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 找到小镇的法官 =====");
console.log("净度:", findJudgeNet(2, [[1, 2]])); // 期望 2
console.log("净度:", findJudgeNet(3, [[1, 3], [2, 3]])); // 期望 3
console.log("净度:", findJudgeNet(3, [[1, 3], [2, 3], [3, 1]])); // 期望 -1
console.log("双数组:", findJudgeDegree(2, [[1, 2]])); // 期望 2
console.log("双数组:", findJudgeDegree(3, [[1, 3], [2, 3]])); // 期望 3
console.log("双数组:", findJudgeDegree(3, [[1, 3], [2, 3], [3, 1]])); // 期望 -1
console.log("双数组:", findJudgeDegree(1, [])); // 期望 1

export {};
