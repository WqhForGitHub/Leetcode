// ============================================================
// 083. 一和零
// ============================================================
// LeetCode 474. Ones and Zeroes
// 给定字符串数组 strs，每个字符串含 0 和 1，给定 m 个 0 和 n 个 1，求最大子集大小
// 时间复杂度：O(l * m * n)，其中 l 为字符串数量

// 方法1：动态规划 - 0-1 背包（推荐）
// dp[j][k] 表示用 j 个 0 和 k 个 1 最多能取的字符串数
// 状态转移：dp[j][k] = max(dp[j][k], dp[j-zeros][k-ones] + 1)
// 倒序遍历避免重复选取（0-1背包标准做法）
// 时间复杂度 O(l * m * n)，空间复杂度 O(m * n)
function findMaxForm(strs: string[], m: number, n: number): number {
  // dp[j][k] 表示用 j 个 0 和 k 个 1 最多能取的字符串数
  const dp: number[][] = new Array(m + 1);
  for (let j: number = 0; j <= m; j++) {
    dp[j] = new Array(n + 1).fill(0);
  }

  for (const s of strs) {
    // 统计当前字符串中 0 和 1 的个数
    let zeros: number = 0;
    let ones: number = 0;
    for (const c of s) {
      if (c === "0") zeros++;
      else ones++;
    }

    // 0-1背包：倒序遍历，保证每个字符串只选一次
    for (let j: number = m; j >= zeros; j--) {
      for (let k: number = n; k >= ones; k--) {
        // 状态转移：不选 s 或选 s（消耗 zeros 个0和 ones 个1）
        dp[j][k] = Math.max(dp[j][k], dp[j - zeros][k - ones] + 1);
      }
    }
  }

  return dp[m][n];
}

// 方法2：递归 + 记忆化
// 从第 index 个字符串开始，剩余 m 个 0 和 n 个 1，能取的最大数量
// 时间复杂度 O(l * m * n)，空间复杂度 O(l * m * n)
function findMaxFormMemo(strs: string[], m: number, n: number): number {
  // 预处理每个字符串的 0 和 1 的个数
  const counts: [number, number][] = strs.map((s: string): [number, number] => {
    let zeros: number = 0;
    for (const c of s) {
      if (c === "0") zeros++;
    }
    return [zeros, s.length - zeros];
  });

  const memo: Map<string, number> = new Map();

  function solve(index: number, remM: number, remN: number): number {
    if (index === strs.length) return 0;
    const key: string = `${index},${remM},${remN}`;
    if (memo.has(key)) return memo.get(key)!;

    // 不选当前字符串
    let result: number = solve(index + 1, remM, remN);

    // 选当前字符串（如果资源足够）
    const [zeros, ones]: [number, number] = counts[index];
    if (zeros <= remM && ones <= remN) {
      result = Math.max(result, 1 + solve(index + 1, remM - zeros, remN - ones));
    }

    memo.set(key, result);
    return result;
  }

  return solve(0, m, n);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 一和零 =====");
console.log(findMaxForm(["10", "0001", "111001", "1", "0"], 5, 3)); // 期望结果: 4
console.log(findMaxForm(["10", "0", "1"], 1, 1)); // 期望结果: 2
console.log(findMaxForm(["10", "0001", "111001", "1", "0"], 3, 4)); // 期望结果: 3
console.log(findMaxForm(["0", "11", "1000", "01", "111", "001", "11"], 5, 3)); // 期望结果: 4

console.log(findMaxFormMemo(["10", "0001", "111001", "1", "0"], 5, 3)); // 期望结果: 4
console.log(findMaxFormMemo(["10", "0", "1"], 1, 1)); // 期望结果: 2

export {};
