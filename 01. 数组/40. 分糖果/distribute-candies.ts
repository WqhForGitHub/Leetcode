// ============================================================
// 40. 分糖果
// ============================================================
// LeetCode 575. Distribute Candies
// 给定偶数长度整数数组表示糖果类型，将糖果分给弟弟和妹妹各一半，求妹妹能获得的最大糖果种类数。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：Set 取种类数和一半的较小值（推荐）
function distributeCandies(candyType: number[]): number {
  // 妹妹分得 n/2 颗糖果（n 为糖果总数）
  const half = candyType.length / 2;

  // 用 Set 统计糖果种类数
  const types = new Set<number>(candyType);

  // 妹妹最多能获得的种类数 = min(种类数, 一半的糖果数)
  // 因为妹妹只能拿 n/2 颗，所以种类数不可能超过 n/2
  return Math.min(types.size, half);
}

// 方法2：排序去重
function distributeCandiesSort(candyType: number[]): number {
  const half = candyType.length / 2;

  // 排序后统计不同种类数
  candyType.sort((a, b) => a - b);
  let typeCount = 1;
  for (let i = 1; i < candyType.length; i++) {
    if (candyType[i] !== candyType[i - 1]) {
      typeCount++;
    }
  }

  return Math.min(typeCount, half);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 40. 分糖果 =====");
console.log("描述:", distributeCandies([1, 1, 2, 2, 3, 3])); // 期望结果: 3
console.log("描述:", distributeCandies([1, 1, 2, 3])); // 期望结果: 2
console.log("描述:", distributeCandies([6, 6, 6, 6])); // 期望结果: 1
console.log("描述:", distributeCandiesSort([1, 1, 2, 2, 3, 3])); // 期望结果: 3

export {};
