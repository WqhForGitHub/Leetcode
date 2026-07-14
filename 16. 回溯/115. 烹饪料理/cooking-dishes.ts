// ============================================================
// 115. 烹饪料理
// ============================================================
// 给定每种食材的成本 costs 和满意度 satisfaction，以及预算 budget，
// 选一个子集使总成本 <= budget 且总满意度最大。等价 0/1 背包，用回溯求解。

// 时间复杂度：O(2^n) 最坏
// 空间复杂度：O(n) 递归栈

// 方法1：回溯（选 / 不选）
// 对每个食材决定选或不选，维护当前成本与满意度，记录最大满意度。
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function cookDishes(costs: number[], satisfaction: number[], budget: number): number {
  const n: number = costs.length;
  let best: number = 0;

  function backtrack(index: number, curCost: number, curSat: number): void {
    if (curCost > budget) return; // 超预算剪枝
    if (index === n) {
      if (curCost <= budget && curSat > best) best = curSat;
      return;
    }
    // 不选 index
    backtrack(index + 1, curCost, curSat);
    // 选 index
    backtrack(index + 1, curCost + costs[index], curSat + satisfaction[index]);
  }

  backtrack(0, 0, 0);
  return best;
}

// 方法2：回溯 + 排序剪枝
// 按性价比（满意度/成本）降序排序，
// 用剩余物品全选的乐观估计剪枝：若当前满意度 + 剩余最大可能满意度 <= best 则剪。
// 时间复杂度 O(2^n) 最坏但实际更优；空间复杂度 O(n)
function cookDishes2(costs: number[], satisfaction: number[], budget: number): number {
  const n: number = costs.length;
  // 按性价比降序排序
  const items: Array<{ c: number; s: number; ratio: number }> = [];
  for (let i: number = 0; i < n; i++) {
    items.push({ c: costs[i], s: satisfaction[i], ratio: satisfaction[i] / Math.max(1, costs[i]) });
  }
  items.sort((a, b) => b.ratio - a.ratio);

  // 后缀满意度总和（乐观上界）
  const suffixSat: number[] = new Array(n + 1).fill(0);
  for (let i: number = n - 1; i >= 0; i--) {
    suffixSat[i] = suffixSat[i + 1] + items[i].s;
  }

  let best: number = 0;

  function backtrack(index: number, curCost: number, curSat: number): void {
    if (curCost > budget) return;
    // 剪枝：即使后面全部选中也无法超过当前最优
    if (curSat + suffixSat[index] <= best) return;
    if (index === n) {
      if (curCost <= budget && curSat > best) best = curSat;
      return;
    }
    // 选（先选性价比高的更易早获得较优解）
    backtrack(index + 1, curCost + items[index].c, curSat + items[index].s);
    // 不选
    backtrack(index + 1, curCost, curSat);
  }

  backtrack(0, 0, 0);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 115. 烹饪料理 =====");
console.log(cookDishes([2, 3, 5], [4, 5, 6], 8)); // 期望: 11 (选 1,2: cost=8, sat=11)
console.log(cookDishes2([2, 3, 5], [4, 5, 6], 8)); // 期望: 11
console.log(cookDishes([1, 2, 3], [6, 10, 12], 5)); // 期望: 22 (选 1,2: cost=5, sat=22)
console.log(cookDishes2([1, 2, 3], [6, 10, 12], 5)); // 期望: 22

export {};
