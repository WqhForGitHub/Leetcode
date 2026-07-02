// ============================================================
// 169. 通过投票对团队排名
// ============================================================
// LeetCode 1366. Rank Teams by Votes
// 给定若干投票字符串（每个为团队字母的排列），按第 i 名票数多少排序团队；
// 票数相同则看下一名次，最终仍相同按字母序。返回排好序的团队字符串。

// 方法1：二维计数表 + 自定义排序（O(V * L + L^2)）
function rankTeams1(votes: string[]): string {
  if (votes.length === 0) return "";
  const teams = votes[0].split("");
  const n = teams.length;
  // tally[team][pos] = 该 team 作为第 pos 名的票数
  const tally: Record<string, number[]> = {};
  for (const t of teams) tally[t] = new Array<number>(n).fill(0);
  for (const vote of votes) {
    for (let i = 0; i < vote.length; i++) {
      tally[vote[i]][i]++;
    }
  }
  teams.sort((a, b) => {
    for (let i = 0; i < n; i++) {
      if (tally[a][i] !== tally[b][i]) return tally[b][i] - tally[a][i];
    }
    return a < b ? -1 : 1;
  });
  return teams.join("");
}

// 方法2：Map 票数统计 + 排序（O(V * L + L^2)）
function rankTeams2(votes: string[]): string {
  if (votes.length === 0) return "";
  const teams = votes[0].split("");
  const n = teams.length;
  const tally = new Map<string, number[]>();
  for (const t of teams) tally.set(t, new Array<number>(n).fill(0));
  for (const vote of votes) {
    for (let i = 0; i < vote.length; i++) {
      const arr = tally.get(vote[i])!;
      arr[i]++;
    }
  }
  const sorted = [...teams].sort((a, b) => {
    const va = tally.get(a)!;
    const vb = tally.get(b)!;
    for (let i = 0; i < n; i++) {
      if (va[i] !== vb[i]) return vb[i] - va[i];
    }
    return a < b ? -1 : 1;
  });
  return sorted.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 169. 通过投票对团队排名 =====");
console.log("方法1 [ABC,ACB,ABC,ACB,ACB]:", rankTeams1(["ABC", "ACB", "ABC", "ACB", "ACB"])); // "ACB"
console.log("方法2 [ABC,ACB,ABC,ACB,ACB]:", rankTeams2(["ABC", "ACB", "ABC", "ACB", "ACB"])); // "ACB"
console.log("方法1 [WXYZ,XYZW]:", rankTeams1(["WXYZ", "XYZW"])); // "XWYZ"
console.log("方法2 [WXYZ,XYZW]:", rankTeams2(["WXYZ", "XYZW"])); // "XWYZ"
console.log("方法1 [BAC,BAC,ACB]:", rankTeams1(["BAC", "BAC", "ACB"])); // "BAC"
console.log("方法2 [BAC,BAC,ACB]:", rankTeams2(["BAC", "BAC", "ACB"])); // "BAC"

export {};
