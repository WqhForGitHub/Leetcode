// ============================================================
// 169. 分配给商店的最多商品的最小值
// ============================================================
// LeetCode 2064. Minimized Maximum of Products Distributed to Any Store
// 有 n 家商店，quantities[i] 表示第 i 种商品的数量。
// 同一种商品只能分配给一家商店（可多家），求每家商店最多分到的商品数的最小值。

// 方法1：二分答案
function minimizedMaximum(n: number, quantities: number[]): number {
  function canDistribute(maxProducts: number): boolean {
    let storesNeeded = 0;
    for (const q of quantities) {
      storesNeeded += Math.ceil(q / maxProducts);
    }
    return storesNeeded <= n;
  }

  let left = 1;
  let right = Math.max(...quantities);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canDistribute(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 169. 分配给商店的最多商品的最小值 =====");
console.log("6,[11,6]:", minimizedMaximum(6, [11, 6])); // 3
console.log("7,[15,10,10]:", minimizedMaximum(7, [15, 10, 10])); // 5
console.log("1,[100000]:", minimizedMaximum(1, [100000])); // 100000

export {};
