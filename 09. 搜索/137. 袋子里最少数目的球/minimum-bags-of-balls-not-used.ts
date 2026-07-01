// ============================================================
// 137. 袋子里最少数目的球
// ============================================================
// LeetCode 1760. Minimum Limit of Balls in a Bag
// 每次可将一袋 n 个球分成两袋，最多操作 maxOperations 次，最小化最大袋子球数。

// 方法1：二分查找
function minimumSize(nums: number[], maxOperations: number): number {
  let left = 1;
  let right = Math.max(...nums);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canDivide(nums, mid, maxOperations)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canDivide(nums: number[], maxSize: number, maxOps: number): boolean {
  let ops = 0;
  for (const num of nums) {
    // 需要的操作数 = ceil(num / maxSize) - 1
    ops += Math.ceil(num / maxSize) - 1;
    if (ops > maxOps) return false;
  }
  return ops <= maxOps;
}

// 方法2：二分查找（优化计算）
function minimumSizeOpt(nums: number[], maxOperations: number): number {
  let lo = 1;
  let hi = Math.max(...nums);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let ops = 0;
    for (const num of nums) {
      ops += Math.floor((num - 1) / mid);
      if (ops > maxOperations) break;
    }
    if (ops <= maxOperations) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 137. 袋子里最少数目的球 =====");
console.log("二分 [9],2:", minimumSize([9], 2)); // 3
console.log("二分 [2,4,8,2],4:", minimumSize([2, 4, 8, 2], 4)); // 2
console.log("二分 [7,17],2:", minimumSize([7, 17], 2)); // 7
console.log("优化 [9],2:", minimumSizeOpt([9], 2)); // 3

export {};
