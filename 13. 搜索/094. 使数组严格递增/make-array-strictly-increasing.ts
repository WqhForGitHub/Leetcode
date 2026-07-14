// ============================================================
// 094. 使数组严格递增
// ============================================================
// LeetCode 1187. Make Array Strictly Increasing
// 给定两个数组 arr1 和 arr2，用 arr2 中元素替换 arr1 中元素，使 arr1 严格递增的最少操作。

// 方法1：动态规划 + 二分查找
function makeArrayIncreasing(arr1: number[], arr2: number[]): number {
  arr2.sort((a, b) => a - b);
  // 去重
  const uniqueArr2: number[] = [];
  for (const v of arr2) {
    if (uniqueArr2.length === 0 || uniqueArr2[uniqueArr2.length - 1] !== v) {
      uniqueArr2.push(v);
    }
  }
  arr2 = uniqueArr2;

  const n = arr1.length;
  // dp[i] = { 保持 arr1[i] 时的前一个值: 最少操作数 }
  // 用 Map<prevVal, minOps>
  let dp = new Map<number, number>();
  dp.set(-1, 0); // 初始状态：前一个值为 -Infinity（用 -1 代替不够，用更小值）

  // 实际上用 -Infinity 更准确
  dp = new Map();
  dp.set(-Infinity, 0);

  for (let i = 0; i < n; i++) {
    const newDp = new Map<number, number>();
    for (const [prevVal, ops] of dp) {
      // 选择1：不替换 arr1[i]
      if (arr1[i] > prevVal) {
        const key = arr1[i];
        newDp.set(key, Math.min(newDp.get(key) ?? Infinity, ops));
      }
      // 选择2：用 arr2 中最小的 > prevVal 的值替换
      let lo = 0;
      let hi = arr2.length - 1;
      let idx = arr2.length;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr2[mid] > prevVal) {
          idx = mid;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      if (idx < arr2.length) {
        const key = arr2[idx];
        newDp.set(key, Math.min(newDp.get(key) ?? Infinity, ops + 1));
      }
    }
    dp = newDp;
  }

  let result = Infinity;
  for (const ops of dp.values()) {
    result = Math.min(result, ops);
  }
  return result === Infinity ? -1 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 使数组严格递增 =====");
console.log("DP [1,5,3,6,7],[1,3,2,4]:", makeArrayIncreasing([1, 5, 3, 6, 7], [1, 3, 2, 4])); // 1
console.log("DP [1,5,3,6,7],[4,3,1]:", makeArrayIncreasing([1, 5, 3, 6, 7], [4, 3, 1])); // 2
console.log("DP [1,5,3,6,7],[1,6,3,3]:", makeArrayIncreasing([1, 5, 3, 6, 7], [1, 6, 3, 3])); // -1

export {};
