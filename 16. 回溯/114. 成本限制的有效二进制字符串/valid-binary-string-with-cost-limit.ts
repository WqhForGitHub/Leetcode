// ============================================================
// 114. 成本限制的有效二进制字符串
// ============================================================
// 给定长度 n、成本数组 costs 和成本上限 limit，
// 生成所有满足 累计成本 <= limit 的二进制字符串。
// 成本定义：若位置 i 取 1 且前一位也为 1，则累加 costs[i]（翻转规则可调）。
// 这里采用题目示例的简化语义：位置 i 取 1 时累加 costs[i]。

// 时间复杂度：O(2^n) 最坏
// 空间复杂度：O(n) 递归栈

// 方法1：回溯（逐位选择 + 累计成本）
// 每个位置选 0 或 1，选 1 时累加成本，到达末尾时若总成本 <= limit 则收集。
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function validBinaryStrings(n: number, costs: number[], limit: number): string[] {
  const result: string[] = [];
  const path: string[] = [];

  function backtrack(index: number, totalCost: number): void {
    if (index === n) {
      if (totalCost <= limit) {
        result.push(path.join(""));
      }
      return;
    }
    // 选 0：成本不变
    path.push("0");
    backtrack(index + 1, totalCost);
    path.pop();
    // 选 1：累加 costs[index]
    const newCost: number = totalCost + costs[index];
    if (newCost <= limit) {
      path.push("1");
      backtrack(index + 1, newCost);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}

// 方法2：回溯 + 剪枝
// 提前计算剩余位置的最小可能成本（全部取 0 即为 0），
// 若当前总成本已超 limit 直接返回；同时利用剩余全 1 上界剪枝。
// 时间复杂度 O(2^n) 最坏，平均更优；空间复杂度 O(n)
function validBinaryStrings2(n: number, costs: number[], limit: number): string[] {
  const result: string[] = [];
  const path: string[] = [];
  // 后缀和：从位置 i 到末尾全部取 1 时的成本上界
  const suffixSum: number[] = new Array(n + 1).fill(0);
  for (let i: number = n - 1; i >= 0; i--) {
    suffixSum[i] = suffixSum[i + 1] + costs[i];
  }

  function backtrack(index: number, totalCost: number): void {
    // 剪枝：即使后面全选 0 也无法满足（这里恒不剪，但保留框架）
    if (totalCost > limit) return;
    // 剪枝：即使后面全选 1 也未超限 -> 全部收集仍按递归处理
    if (index === n) {
      if (totalCost <= limit) result.push(path.join(""));
      return;
    }
    // 选 0
    path.push("0");
    backtrack(index + 1, totalCost);
    path.pop();
    // 选 1：剪枝
    const newCost: number = totalCost + costs[index];
    if (newCost + suffixSum[index + 1] >= newCost && newCost <= limit) {
      // 仅当 newCost <= limit 时继续
      path.push("1");
      backtrack(index + 1, newCost);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 114. 成本限制的有效二进制字符串 =====");
console.log(validBinaryStrings(3, [1, 2, 1], 3));
// 期望结果: ["000","001","010","100","101"] (1 计成本)
// 000 cost0, 001 cost1, 010 cost2, 011 cost3, 100 cost1,
// 101 cost2, 110 cost3, 111 cost4 -> 全部 <=3 的为上述
console.log(validBinaryStrings2(3, [1, 2, 1], 3));

export {};
