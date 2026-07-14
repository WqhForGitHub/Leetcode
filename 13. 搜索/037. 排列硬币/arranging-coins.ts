// ============================================================
// 037. 排列硬币
// ============================================================
// LeetCode 441. Arranging Coins
// n 枚硬币排成阶梯形，第 k 行放 k 枚，返回完整的行数。

// 方法1：二分查找
function arrangeCoins(n: number): number {
  let left = 0;
  let right = n;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // 前 mid 行需要的硬币数：mid*(mid+1)/2
    const need = (mid * (mid + 1)) / 2;
    if (need === n) return mid;
    if (need < n) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return right;
}

// 方法2：数学公式
function arrangeCoinsMath(n: number): number {
  // k(k+1)/2 <= n => k <= (-1 + sqrt(1+8n)) / 2
  return Math.floor((-1 + Math.sqrt(1 + 8 * n)) / 2);
}

// 方法3：迭代累加
function arrangeCoinsIterative(n: number): number {
  let k = 0;
  while (n >= k + 1) {
    k++;
    n -= k;
  }
  return k;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 排列硬币 =====");
console.log("二分 5:", arrangeCoins(5)); // 2
console.log("二分 8:", arrangeCoins(8)); // 3
console.log("公式 5:", arrangeCoinsMath(5)); // 2
console.log("迭代 8:", arrangeCoinsIterative(8)); // 3

export {};
