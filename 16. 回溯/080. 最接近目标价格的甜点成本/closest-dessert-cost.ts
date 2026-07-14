// ============================================================
// 080. 最接近目标价格的甜点成本
// ============================================================
// LeetCode 1774. Closest Dessert Cost
// 给定基料成本 baseCosts 和配料成本 toppingCosts（每种配料可用 0/1/2 次），
// 选择一种基料和若干配料，使总成本最接近 target。若并列返回较低成本。
// 时间复杂度：O(n * 3^m)（回溯）或 O(n * m * maxCost)（DP）。

// 方法1：回溯 (推荐)
// 对每种基料，回溯枚举每种配料的 0/1/2 次，维护最接近 target 的成本。
// 剪枝：当前成本 >= target 时不再加配料（只会更远）。
// 时间复杂度：O(n * 3^m)，空间复杂度：O(m) 递归栈
function closestCost1(baseCosts: number[], toppingCosts: number[], target: number): number {
  let best: number = Infinity;

  const update = (cost: number): void => {
    const diffNew: number = Math.abs(cost - target);
    const diffBest: number = Math.abs(best - target);
    if (diffNew < diffBest || (diffNew === diffBest && cost < best)) {
      best = cost;
    }
  };

  const backtrack = (idx: number, cost: number): void => {
    update(cost);
    // 剪枝：成本已 >= target，再加配料只会更远
    if (cost >= target) return;
    if (idx === toppingCosts.length) return;
    // 不加 / 加 1 / 加 2
    backtrack(idx + 1, cost);
    backtrack(idx + 1, cost + toppingCosts[idx]);
    backtrack(idx + 1, cost + 2 * toppingCosts[idx]);
  };

  for (const base of baseCosts) {
    backtrack(0, base);
  }

  return best;
}

// 方法2：动态规划
// 用集合维护当前可达成本，对每种配料扩展 0/1/2 倍。最终在所有可达成本中找最接近 target 的。
// 时间复杂度：O(n * m * maxCost)，空间复杂度：O(maxCost)
function closestCost2(baseCosts: number[], toppingCosts: number[], target: number): number {
  let reachable: Set<number> = new Set(baseCosts);

  for (const topping of toppingCosts) {
    const newReachable: Set<number> = new Set();
    for (const cost of reachable) {
      newReachable.add(cost);
      newReachable.add(cost + topping);
      newReachable.add(cost + 2 * topping);
    }
    reachable = newReachable;
  }

  let best: number = Infinity;
  for (const cost of reachable) {
    const diffNew: number = Math.abs(cost - target);
    const diffBest: number = Math.abs(best - target);
    if (diffNew < diffBest || (diffNew === diffBest && cost < best)) {
      best = cost;
    }
  }

  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 最接近目标价格的甜点成本 =====");
console.log(closestCost1([1, 7], [3, 4], 10)); // 期望结果: 10
console.log(closestCost1([3, 10], [2, 5], 9)); // 期望结果: 8
console.log(closestCost1([2, 3], [4, 5, 100], 18)); // 期望结果: 17
console.log(closestCost1([10], [1], 1)); // 期望结果: 10
console.log(closestCost2([1, 7], [3, 4], 10)); // 期望结果: 10
console.log(closestCost2([3, 10], [2, 5], 9)); // 期望结果: 8
console.log(closestCost2([2, 3], [4, 5, 100], 18)); // 期望结果: 17

export {};
