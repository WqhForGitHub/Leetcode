// ============================================================
// 149. 宝石与石头
// ============================================================
// LeetCode 771. Jewels and Stones
// 字符串 jewels 表示宝石（区分大小写），stones 表示你拥有的石头。
// 返回 stones 中有多少颗是宝石。
// 时间复杂度：O(n + m)；空间复杂度：O(n)

function numJewelsInStones(jewels: string, stones: string): number {
  // 哈希集合存宝石
  const jewelSet = new Set<string>();
  for (const j of jewels) jewelSet.add(j);

  let count = 0;
  for (const s of stones) {
    if (jewelSet.has(s)) count++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 149. 宝石与石头 =====");
console.log(numJewelsInStones("aA", "aAAbbbb")); // 期望: 3
console.log(numJewelsInStones("z", "ZZ")); // 期望: 0

export {};
