// ============================================================
// 145. 找出变位映射
// ============================================================
// LeetCode 760. Find Anagram Mappings
// 给定两数组 A 和 B，B 是 A 的变位（重排）。对 A 中每个元素，返回其在 B 中的下标。
// 时间复杂度：O(n)，空间复杂度：O(n)

function anagramMappings(nums1: number[], nums2: number[]): number[] {
  // 哈希表：B 中值 -> 下标列表
  const indexMap = new Map<number, number[]>();
  nums2.forEach((v, i) => {
    if (!indexMap.has(v)) indexMap.set(v, []);
    indexMap.get(v)!.push(i);
  });

  const result: number[] = [];
  for (const v of nums1) {
    result.push(indexMap.get(v)!.pop()!);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 145. 找出变位映射 =====");
console.log(anagramMappings([12, 28, 46, 32, 50], [50, 12, 32, 46, 28]));
// 期望: [1, 4, 3, 2, 0] （或类似变位映射）
console.log(anagramMappings([1, 2, 3], [3, 2, 1])); // 期望: [2, 1, 0]

export {};
