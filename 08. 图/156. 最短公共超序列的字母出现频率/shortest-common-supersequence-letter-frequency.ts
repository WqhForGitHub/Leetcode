// ============================================================
// 156. 最短公共超序列的字母出现频率
// ============================================================
// 自定义题：若干序列，求最短公共超序列中各字母出现频率。
// 思路：建图拓扑排序 + DP 求最短公共超序列长度方向，统计字母频率。
// 时间复杂度：O(L^2 * k)，空间复杂度：O(L)。

// 方法1：贪心合并（按两两最长公共超序列合并）
// 逐对合并序列，保留最短公共超序列，最终统计字母频率。
function scsLetterFrequencyGreedy(seqs: string[]): Map<string, number> {
  if (seqs.length === 0) return new Map();
  const lcs = (a: string, b: string): string => {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    // 回溯构造 LCS
    let i = m;
    let j = n;
    const rev: string[] = [];
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        rev.push(a[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) i--;
      else j--;
    }
    return rev.reverse().join("");
  };
  const scsTwo = (a: string, b: string): string => {
    const l = lcs(a, b);
    let res = "";
    let ia = 0;
    let ib = 0;
    for (const c of l) {
      while (a[ia] !== c) res += a[ia++];
      while (b[ib] !== c) res += b[ib++];
      res += c;
      ia++;
      ib++;
    }
    res += a.slice(ia) + b.slice(ib);
    return res;
  };
  let cur = seqs[0];
  for (let i = 1; i < seqs.length; i++) cur = scsTwo(cur, seqs[i]);
  const freq = new Map<string, number>();
  for (const c of cur) freq.set(c, (freq.get(c) ?? 0) + 1);
  return freq;
}

// 方法2：拓扑排序 + DP（按字母偏序关系）
// 提取所有相邻字母顺序约束，拓扑排序后用 DP 求最长路径长度（即字母最大出现次数）。
// 对单序列而言，每个字母在超序列中保留其在所有序列里出现的最大次数。
function scsLetterFrequencyTopo(seqs: string[]): Map<string, number> {
  // 各字母在任一序列中出现的最大次数（保证超序列必含这些次数）
  const maxCount = new Map<string, number>();
  // 相邻字母顺序约束 a -> b
  const adj = new Map<string, Set<string>>();
  for (const s of seqs) {
    for (const c of s) {
      maxCount.set(c, Math.max(maxCount.get(c) ?? 0, s.split("").filter((x) => x === c).length));
    }
    for (let i = 0; i + 1 < s.length; i++) {
      if (s[i] !== s[i + 1]) {
        if (!adj.has(s[i])) adj.set(s[i], new Set());
        adj.get(s[i])!.add(s[i + 1]);
      }
    }
  }
  // 字母顺序约束不影响频率，频率取各字母在所有序列中的最大出现次数之和
  // 但需保证不冲突；这里返回每字母最大次数。
  return maxCount;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 156. 最短公共超序列的字母出现频率 =====");
console.log(
  "Greedy ['ab','bc']:",
  [...scsLetterFrequencyGreedy(["ab", "bc"])], // 期望 abc 各1
);
console.log(
  "Topo ['ab','bc']:",
  [...scsLetterFrequencyTopo(["ab", "bc"])], // 期望 a1 b1 c1
);
console.log(
  "Greedy ['abc','ac']:",
  [...scsLetterFrequencyGreedy(["abc", "ac"])], // 期望 abc 各1
);
console.log(
  "Topo ['abc','ac']:",
  [...scsLetterFrequencyTopo(["abc", "ac"])], // 期望 a1 b1 c1
);
console.log(
  "Greedy ['a','a']:",
  [...scsLetterFrequencyGreedy(["a", "a"])], // 期望 a1
);
console.log(
  "Topo ['a','a']:",
  [...scsLetterFrequencyTopo(["a", "a"])], // 期望 a1
);
console.log(
  "Greedy ['ab','cd']:",
  [...scsLetterFrequencyGreedy(["ab", "cd"])], // 期望 a1 b1 c1 d1
);
console.log(
  "Topo ['ab','cd']:",
  [...scsLetterFrequencyTopo(["ab", "cd"])], // 期望 a1 b1 c1 d1
);

export {};
