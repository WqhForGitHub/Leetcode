// ============================================================
// 077. 最优账单平衡
// ============================================================
// LeetCode 465. Optimal Account Balancing
// 给定一组交易 [from, to, amount]，求清算所有债务的最少交易次数。
// 时间复杂度：O(2^n * n)，空间复杂度：O(2^n)

// 方法1：DP + 位掩码（推荐）
// 先计算每人净值，去掉为0的，用位掩码DP求最少交易次数
// 时间复杂度 O(2^n * n)，空间复杂度 O(2^n)
function minTransfers(transactions: number[][]): number {
  // 计算每个人的净值
  const balanceMap: Map<number, number> = new Map();
  for (const tx of transactions) {
    const from: number = tx[0];
    const to: number = tx[1];
    const amount: number = tx[2];
    balanceMap.set(from, (balanceMap.get(from) || 0) - amount);
    balanceMap.set(to, (balanceMap.get(to) || 0) + amount);
  }

  // 收集非零净值
  const debts: number[] = [];
  for (const val of balanceMap.values()) {
    if (val !== 0) debts.push(val);
  }

  const n: number = debts.length;
  if (n === 0) return 0;

  // dp[mask] 表示在 mask 表示的子集中，净值和为0的最大子集大小
  // 用 dp 来找最少交易次数
  // sum[mask] 表示 mask 中所有净值的和
  const total: number = 1 << n;
  const dp: number[] = new Array(total).fill(0);
  const sum: number[] = new Array(total).fill(0);

  for (let mask: number = 0; mask < total; mask++) {
    for (let i: number = 0; i < n; i++) {
      if (mask & (1 << i)) {
        const prevMask: number = mask ^ (1 << i);
        sum[mask] = sum[prevMask] + debts[i];
        break;
      }
    }
    // 如果该子集净值和为0，则可以一次清零
    if (sum[mask] === 0) {
      dp[mask] = 1;
      for (let i: number = 0; i < n; i++) {
        if (mask & (1 << i)) {
          const sub: number = mask ^ (1 << i);
          if (sum[sub] + debts[i] === 0 || dp[sub] > 0) {
            // 尝试找最优分割
          }
        }
      }
      // 枚举子集
      for (let sub: number = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
        if (sum[sub] === 0 && dp[sub] > 0) {
          dp[mask] = Math.max(dp[mask], dp[sub] + 1);
        }
      }
    }
  }

  // 最少交易次数 = n - 最大可清零分组数
  return n - dp[total - 1];
}

// 方法2：DFS 回溯
// 贪心地配对正负净值
// 时间复杂度 O(n!)，空间复杂度 O(n)
function minTransfersDFS(transactions: number[][]): number {
  const balanceMap: Map<number, number> = new Map();
  for (const tx of transactions) {
    balanceMap.set(tx[0], (balanceMap.get(tx[0]) || 0) - tx[2]);
    balanceMap.set(tx[1], (balanceMap.get(tx[1]) || 0) + tx[2]);
  }

  const debts: number[] = [];
  for (const val of balanceMap.values()) {
    if (val !== 0) debts.push(val);
  }

  const n: number = debts.length;
  const dfs = (start: number): number => {
    // 跳过已经清零的
    while (start < n && debts[start] === 0) start++;
    if (start === n) return 0;

    let result: number = Infinity;
    for (let i: number = start + 1; i < n; i++) {
      // 只在正负相反时配对
      if (debts[i] * debts[start] < 0) {
        debts[i] += debts[start];
        result = Math.min(result, 1 + dfs(start + 1));
        debts[i] -= debts[start];
      }
    }
    return result === Infinity ? 0 : result;
  };

  return dfs(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 最优账单平衡 =====");
console.log(
  minTransfers([
    [0, 1, 10],
    [2, 0, 5],
  ]),
); // 期望结果: 2
console.log(
  minTransfers([
    [0, 1, 10],
    [1, 0, 1],
    [1, 2, 5],
    [2, 0, 5],
  ]),
); // 期望结果: 1
console.log(
  minTransfers([
    [0, 1, 5],
    [2, 3, 5],
  ]),
); // 期望结果: 2
console.log("--- 方法2测试 ---");
console.log(
  minTransfersDFS([
    [0, 1, 10],
    [2, 0, 5],
  ]),
); // 期望结果: 2
console.log(
  minTransfersDFS([
    [0, 1, 5],
    [2, 3, 5],
  ]),
); // 期望结果: 2

export {};
