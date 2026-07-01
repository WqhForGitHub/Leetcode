// ============================================================
// 129. 销售价值减少的颜色球
// ============================================================
// LeetCode 1648. Sell Diminishing-Valued Colored Balls
// 有 inventory 数组，每次卖一个球价值为当前数量，求卖出 orders 个球的最大总价值。

// 方法1：二分查找 + 数学计算
function maxProfit1648(inventory: number[], orders: number): number {
  const mod = 1_000_000_007;
  // 排序（降序）
  inventory.sort((a, b) => b - a);
  let result = 0;
  let n = inventory.length;
  // 二分找阈值 T，使得所有 > T 的颜色都卖到 T
  let lo = 0;
  let hi = inventory[0];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    for (const val of inventory) {
      if (val > mid) count += val - mid;
      else break;
    }
    if (count >= orders) lo = mid + 1;
    else hi = mid;
  }
  const threshold = lo;
  // 卖出所有 > threshold 的球
  for (const val of inventory) {
    if (val > threshold) {
      result = (result + ((val + threshold + 1) * (val - threshold)) / 2) % mod;
      orders -= val - threshold;
    } else break;
  }
  // 剩余 orders 个球每个价值为 threshold
  result = (result + orders * threshold) % mod;
  return result;
}

// 方法2：贪心 + 数学（处理相同值）
function maxProfit1648Greedy(inventory: number[], orders: number): number {
  const mod = BigInt(1_000_000_007);
  inventory.sort((a, b) => b - a);
  inventory.push(0);
  let result = 0n;
  let remaining = BigInt(orders);
  for (let i = 0; i < inventory.length - 1 && remaining > 0n; i++) {
    const count = BigInt(i + 1); // 当前有多少颜色值相同
    const diff = BigInt(inventory[i] - inventory[i + 1]);
    const total = count * diff;
    if (total <= remaining) {
      // 卖掉所有这些颜色到 inventory[i+1]
      result += count * (BigInt(inventory[i]) + BigInt(inventory[i + 1]) + 1n) * diff / 2n;
      remaining -= total;
    } else {
      // 只能卖 remaining 个
      const q = remaining / count;
      const r = remaining % count;
      result += count * (BigInt(inventory[i]) + BigInt(inventory[i]) - q + 1n) * q / 2n;
      result += r * (BigInt(inventory[i]) - q);
      remaining = 0n;
    }
  }
  return Number(result % mod);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 129. 销售价值减少的颜色球 =====");
console.log("二分 [2,5],4:", maxProfit1648([2, 5], 4)); // 14
console.log("二分 [3,5],6:", maxProfit1648([3, 5], 6)); // 19
console.log("贪心 [1000000000],1000000000:", maxProfit1648Greedy([1000000000], 1000000000)); // 21

export {};
