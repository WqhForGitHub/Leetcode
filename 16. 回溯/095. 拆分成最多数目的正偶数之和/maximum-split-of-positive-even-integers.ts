// ============================================================
// 095. 拆分成最多数目的正偶数之和
// ============================================================
// LeetCode 2178. Maximum Split of Positive Even Integers
// 给定 finalSum，将其拆分为最多个互不相同的正偶数之和；若不可行返回空数组。
// 时间复杂度：O(sqrt(finalSum)), 空间复杂度：O(sqrt(finalSum))

// 方法1：贪心 (推荐)
// 从最小偶数 2, 4, 6, ... 依次累加；若剩余值不足以放入下一个，则把剩余合并到最后一个数上。
// 时间复杂度 O(sqrt(finalSum)), 空间复杂度 O(sqrt(finalSum))
function maximumEvenSplit(finalSum: number): number[] {
  // 奇数无法拆分为偶数之和
  if (finalSum % 2 !== 0) return [];
  const result: number[] = [];
  let cur: number = 2;
  let sum: number = 0;
  while (sum + cur <= finalSum) {
    result.push(cur);
    sum += cur;
    cur += 2;
  }
  // 剩余部分并入最后一个数，仍为偶数且互不相同
  if (sum < finalSum) {
    result[result.length - 1] += finalSum - sum;
  }
  return result;
}

// 方法2：回溯
// 递归地尝试下一个不小于 start 的偶数，记录最长拆分。注意大数会超时，仅适用于小规模。
// 时间复杂度 O(2^(finalSum/2)) 最坏, 空间复杂度 O(sqrt(finalSum))
function maximumEvenSplit2(finalSum: number): number[] {
  if (finalSum % 2 !== 0) return [];
  let best: number[] = [];
  const backtrack = (remaining: number, start: number, path: number[]): void => {
    if (remaining === 0) {
      if (path.length > best.length) best = [...path];
      return;
    }
    // 剪枝：剩余路径长度上限 = 已有 + 剩余 / start（粗略上界）
    for (let x: number = start; x <= remaining; x += 2) {
      path.push(x);
      backtrack(remaining - x, x + 2, path);
      path.pop();
    }
  };
  backtrack(finalSum, 2, []);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 拆分成最多数目的正偶数之和 =====");
console.log(maximumEvenSplit(12)); // 期望结果: [2,4,6]
console.log(maximumEvenSplit2(12)); // 期望结果: [2,4,6]
console.log(maximumEvenSplit(7)); // 期望结果: []
console.log(maximumEvenSplit2(7)); // 期望结果: []
console.log(maximumEvenSplit(28)); // 期望结果: [2,4,6,16] 或其他长度为 4 的合法拆分
console.log(maximumEvenSplit2(28)); // 期望结果: [2,4,6,16] 或其他长度为 4 的合法拆分

export {};
