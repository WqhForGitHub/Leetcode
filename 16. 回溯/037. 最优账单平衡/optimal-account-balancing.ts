// ============================================================
// 037. 最优账单平衡
// ============================================================
// LeetCode 465. Optimal Account Balancing
// 给定交易列表[[from,to,amount]]，计算清零所有债务所需的最少交易次数。
// 时间复杂度：O(n!), 空间复杂度：O(n)

// 方法1：回溯(将正负债务匹配) (推荐)
// 先计算每个人的净债务，然后用回溯将正债务和负债务相互抵消，最小化交易次数。
// 时间复杂度 O(n!), 空间复杂度 O(n)
function minTransfers(transactions: number[][]): number {
  // 计算每个人的净债务
  const debtMap: Map<number, number> = new Map();
  for (const [from, to, amount] of transactions) {
    debtMap.set(from, (debtMap.get(from) || 0) - amount);
    debtMap.set(to, (debtMap.get(to) || 0) + amount);
  }

  // 只保留非零债务
  const debts: number[] = Array.from(debtMap.values()).filter((d: number) => d !== 0);

  // 回溯：从位置start开始匹配债务
  function backtrack(start: number): number {
    // 跳过已清零的债务
    while (start < debts.length && debts[start] === 0) start++;
    // 所有债务都清零
    if (start === debts.length) return 0;

    let minTrans: number = Infinity;
    // 尝试将debts[start]与后面的每个异号债务匹配
    for (let i: number = start + 1; i < debts.length; i++) {
      if (debts[i] * debts[start] < 0) {
        // 异号，可以抵消
        debts[i] += debts[start];
        minTrans = Math.min(minTrans, 1 + backtrack(start + 1));
        debts[i] -= debts[start]; // 回溯
      }
    }
    return minTrans;
  }

  return backtrack(0);
}

// 方法2：回溯+去重优化
// 在回溯过程中，如果已经尝试过相同金额的债务匹配，则跳过，避免重复搜索
// 时间复杂度 O(n!), 空间复杂度 O(n)
function minTransfers2(transactions: number[][]): number {
  const debtMap: Map<number, number> = new Map();
  for (const [from, to, amount] of transactions) {
    debtMap.set(from, (debtMap.get(from) || 0) - amount);
    debtMap.set(to, (debtMap.get(to) || 0) + amount);
  }

  const debts: number[] = Array.from(debtMap.values()).filter((d: number) => d !== 0);

  function backtrack(start: number): number {
    while (start < debts.length && debts[start] === 0) start++;
    if (start === debts.length) return 0;

    let minTrans: number = Infinity;
    const seen: Set<number> = new Set(); // 去重：相同金额只尝试一次
    for (let i: number = start + 1; i < debts.length; i++) {
      if (debts[i] * debts[start] < 0 && !seen.has(debts[i])) {
        seen.add(debts[i]);
        debts[i] += debts[start];
        minTrans = Math.min(minTrans, 1 + backtrack(start + 1));
        debts[i] -= debts[start];
      }
    }
    return minTrans;
  }

  return backtrack(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 最优账单平衡 =====");
console.log(
  minTransfers([
    [0, 1, 10],
    [1, 2, 5],
    [2, 0, 5],
  ]),
); // 期望结果: 1
console.log(
  minTransfers([
    [0, 1, 10],
    [2, 0, 5],
  ]),
); // 期望结果: 2
console.log(
  minTransfers2([
    [0, 1, 10],
    [1, 2, 5],
    [2, 0, 5],
  ]),
); // 期望结果: 1
console.log(
  minTransfers2([
    [0, 1, 10],
    [2, 0, 5],
  ]),
); // 期望结果: 2

export {};
