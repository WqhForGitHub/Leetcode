// 166. 所有人渡河所需的最短时间
// n 人过河每次最多 2 人手电筒带回，每人时间不同，求所有人过河最短时间。
// 解法：DP（最快两人往返策略）。

function shortestTimeToCrossRiver(times: number[]): number {
  const t = [...times].sort((a, b) => a - b);
  const n = t.length;
  if (n === 0) return 0;
  if (n === 1) return t[0];
  if (n === 2) return t[1];
  if (n === 3) return t[0] + t[1] + t[2];
  // dp[i] = 把最快的 i+1 个人送过河的最短时间
  const dp: number[] = new Array(n).fill(0);
  dp[0] = t[0];
  dp[1] = t[1];
  dp[2] = t[0] + t[1] + t[2];
  for (let i = 3; i < n; i++) {
    // 策略一：最快的 t[0] 陪送 t[i]
    const a = dp[i - 1] + t[0] + t[i];
    // 策略二：t[0],t[1] 往返送 t[i],t[i-1]
    const b = dp[i - 2] + t[0] + 2 * t[1] + t[i];
    dp[i] = Math.min(a, b);
  }
  return dp[n - 1];
}

// 方法二：递归 + 记忆化
function shortestTimeToCrossRiverMemo(times: number[]): number {
  const t = [...times].sort((a, b) => a - b);
  const memo = new Map<number, number>();
  const solve = (k: number): number => {
    if (k === 1) return t[0];
    if (k === 2) return t[1];
    if (k === 3) return t[0] + t[1] + t[2];
    if (memo.has(k)) return memo.get(k)!;
    const a = solve(k - 1) + t[0] + t[k - 1];
    const b = solve(k - 2) + t[0] + 2 * t[1] + t[k - 1];
    const r = Math.min(a, b);
    memo.set(k, r);
    return r;
  };
  return t.length === 0 ? 0 : solve(t.length);
}

// 测试
console.log(shortestTimeToCrossRiver([1, 2, 5, 10]));
console.log(shortestTimeToCrossRiverMemo([1, 2, 5, 10]));

export {};
