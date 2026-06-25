// ============================================================
// 37. 相对名次
// ============================================================
// LeetCode 506. Relative Ranks
// 给定运动员得分数组 score，返回名次数组。前三名分别为 "Gold Medal"、"Silver Medal"、
// "Bronze Medal"，其余为名次数字字符串。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：排序+哈希映射（推荐）
function findRelativeRanks(score: number[]): string[] {
  // 复制并降序排序，得到排名顺序
  const sorted = [...score].sort((a, b) => b - a);

  // 哈希表：分数 -> 名次字符串
  const rankMap = new Map<number, string>();
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];

  for (let i = 0; i < sorted.length; i++) {
    if (i < 3) {
      rankMap.set(sorted[i], medals[i]);
    } else {
      // 第 i+1 名（i 从 0 开始）
      rankMap.set(sorted[i], String(i + 1));
    }
  }

  // 按原顺序输出名次
  return score.map((s) => rankMap.get(s)!);
}

// 方法2：带索引的排序
function findRelativeRanksByIndex(score: number[]): string[] {
  const n = score.length;
  // 创建索引数组并按分数降序排序
  const indices = score.map((_, i) => i);
  indices.sort((a, b) => score[b] - score[a]);

  const result: string[] = new Array(n);
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];

  for (let i = 0; i < n; i++) {
    const originalIndex = indices[i];
    if (i < 3) {
      result[originalIndex] = medals[i];
    } else {
      result[originalIndex] = String(i + 1);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 37. 相对名次 =====");
console.log("描述:", findRelativeRanks([5, 4, 3, 2, 1])); // 期望结果: ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
console.log("描述:", findRelativeRanks([10, 3, 8, 9, 4])); // 期望结果: ["Gold Medal","5","Bronze Medal","Silver Medal","4"]
console.log("描述:", findRelativeRanksByIndex([5, 4, 3, 2, 1])); // 期望结果: ["Gold Medal","Silver Medal","Bronze Medal","4","5"]

export {};
