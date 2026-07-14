// ============================================================
// 210. 销售价值减少的颜色球
// ============================================================
// LeetCode 1648. Sell Diminishing-Valued Colored Balls
// inventory[i] 表示第 i 种颜色球的数目，每次卖出 1 个球，
// 其价值为当前该颜色的数目，卖完后该颜色数目减 1。
// 共卖 orders 个球，求最大总价值（mod 1e9+7）。

// 方法1：排序 + 二分阈值 + 数学求和（O(n log M)，M 为最大库存）
function maxProfit(inventory: number[], orders: number): number {
  const MOD = 1000000007n;
  let lo = 1;
  let hi = 0;
  for (const inv of inventory) if (inv > hi) hi = inv;
  // countGE(T) = 卖出所有价值 >= T 的球的数量
  const countGE = (T: number): bigint => {
    let sum = 0n;
    for (const inv of inventory) {
      if (inv >= T) sum += BigInt(inv - T + 1);
    }
    return sum;
  };
  // 找最大的 T 使得 countGE(T) >= orders
  let T = 1;
  const need = BigInt(orders);
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (countGE(mid) >= need) {
      T = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  // 价值 > T 的球全部卖出；剩余 (orders - 高价值球数) 个按价值 T 卖出
  let total = 0n;
  let highCount = 0n;
  for (const inv of inventory) {
    if (inv > T) {
      const cnt = BigInt(inv - T);
      const sumVal = ((BigInt(inv) + BigInt(T + 1)) * cnt) / 2n;
      total = (total + sumVal) % MOD;
      highCount += cnt;
    }
  }
  const remaining = need - highCount;
  total = (total + remaining * BigInt(T)) % MOD;
  return Number(((total % MOD) + MOD) % MOD);
}

// 方法2：排序 + 按层模拟（O(n log n)）
// 排序后从最高值开始，每次处理"一层"（多个球同时降到下一档）。
function maxProfit2(inventory: number[], orders: number): number {
  const MOD = 1000000007n;
  const n = inventory.length;
  const sorted = [...inventory].sort((a, b) => b - a);
  sorted.push(0); // 哨兵
  let total = 0n;
  let rem = BigInt(orders);
  for (let i = 0; i < n && rem > 0n; i++) {
    const count = BigInt(i + 1); // 当前层有 i+1 个球处于同一值
    const diff = BigInt(sorted[i] - sorted[i + 1]);
    if (diff === 0n) continue;
    const high = BigInt(sorted[i]);
    const fullBalls = diff * count;
    if (rem >= fullBalls) {
      // 整层全部卖出，值从 high 到 high-diff+1
      const low = high - diff + 1n;
      total = (total + (((high + low) * diff) / 2n) * count) % MOD;
      rem -= fullBalls;
    } else {
      // 部分层：先卖整步，再卖余数
      const steps = rem / count;
      const r = rem % count;
      if (steps > 0n) {
        const low = high - steps + 1n;
        total = (total + (((high + low) * steps) / 2n) * count) % MOD;
      }
      const val = high - steps;
      total = (total + r * val) % MOD;
      rem = 0n;
    }
  }
  return Number(((total % MOD) + MOD) % MOD);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 210. 销售价值减少的颜色球 =====");
console.log("方法1 [2,5],4:", maxProfit([2, 5], 4)); // 14
console.log("方法1 [2,8,4,10,6],20:", maxProfit([2, 8, 4, 10, 6], 20)); // 110
console.log("方法2 [2,5],4:", maxProfit2([2, 5], 4)); // 14
console.log("方法2 [2,8,4,10,6],20:", maxProfit2([2, 8, 4, 10, 6], 20)); // 110

export {};
