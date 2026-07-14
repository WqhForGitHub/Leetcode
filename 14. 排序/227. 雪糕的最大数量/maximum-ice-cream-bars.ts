// ============================================================
// 227. 雪糕的最大数量
// ============================================================
// LeetCode 1833. Maximum Ice Cream Bars
// 给定数组 costs（每根雪糕的价格）和整数 coins（硬币数），求最多可以买到多少根雪糕。

// 方法1：排序 + 贪心累加（O(n log n)）
// 将价格升序排序，从最便宜的开始贪心购买，直到钱不够为止。
function maxIceCream(costs: number[], coins: number): number {
  costs.sort((a, b) => a - b);
  let count = 0;
  for (const c of costs) {
    if (coins >= c) {
      coins -= c;
      count++;
    } else {
      break;
    }
  }
  return count;
}

// 方法2：计数排序（O(n + M)）
// 价格取值有限（<= 1e5），用频率数组统计后从小到大贪心购买。
function maxIceCream2(costs: number[], coins: number): number {
  const MAX = 100001;
  const freq = new Array<number>(MAX).fill(0);
  for (const c of costs) {
    freq[c]++;
  }
  let count = 0;
  for (let price = 1; price < MAX; price++) {
    if (freq[price] === 0) continue;
    if (coins < price) break;
    const canBuy = Math.min(freq[price], Math.floor(coins / price));
    count += canBuy;
    coins -= canBuy * price;
    if (coins < price) break;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 227. 雪糕的最大数量 =====");
console.log("方法1 [1,3,2,4,1],7:", maxIceCream([1, 3, 2, 4, 1], 7));
console.log("方法2 [1,3,2,4,1],7:", maxIceCream2([1, 3, 2, 4, 1], 7));
console.log("方法1 [10,6,8,7,7,8],5:", maxIceCream([10, 6, 8, 7, 7, 8], 5));
console.log("方法2 [10,6,8,7,7,8],5:", maxIceCream2([10, 6, 8, 7, 7, 8], 5));
console.log("方法1 [1,6,3,1,2,5],20:", maxIceCream([1, 6, 3, 1, 2, 5], 20));
console.log("方法2 [1,6,3,1,2,5],20:", maxIceCream2([1, 6, 3, 1, 2, 5], 20));

export {};
