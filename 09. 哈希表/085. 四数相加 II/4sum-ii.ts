// ============================================================
// 085. 四数相加 II
// ============================================================
// LeetCode 454. 4Sum II
// 给定四个整数数组 A, B, C, D，计算满足 A[i]+B[j]+C[k]+D[l]==0 的元组 (i,j,k,l) 数量
// 思路：哈希表存 A[i]+B[j] 的和及其出现次数，再遍历 C[k]+D[l] 查找相反数
// 时间复杂度：O(n^2)，空间复杂度：O(n^2)

function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
  // 哈希表：A[i]+B[j] 的和 -> 出现次数
  const sumMap = new Map<number, number>();

  for (const a of nums1) {
    for (const b of nums2) {
      const sum = a + b;
      sumMap.set(sum, (sumMap.get(sum) ?? 0) + 1);
    }
  }

  // 遍历 C 和 D，查找 -(C[k]+D[l]) 是否在哈希表中
  let count = 0;
  for (const c of nums3) {
    for (const d of nums4) {
      const target = -(c + d);
      count += sumMap.get(target) ?? 0;
    }
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 四数相加 II =====");
console.log(fourSumCount([1, 2], [-2, -1], [-1, 2], [0, 2])); // 期望输出: 2
console.log(fourSumCount([0], [0], [0], [0])); // 期望输出: 1
console.log(fourSumCount([-1, -1], [-1, 1], [-1, 1], [1, -1])); // 期望输出: 6

export {};
