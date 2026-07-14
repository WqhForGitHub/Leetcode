// ============================================================
// 060. 活字印刷
// ============================================================
// LeetCode 1079. Letter Tile Possibilities
// 给定字符串 tiles，返回可以构造的非空字母序列的数目（顺序不同视为不同）。
// 时间复杂度：O(N!), 空间复杂度：O(N)

// 方法1：回溯 + 计数 (推荐)
// 用频率表枚举每个字母的剩余次数，每种选择产生一个新序列
// 时间复杂度 O(N!), 空间复杂度 O(N)
function numTilePossibilities(tiles: string): number {
  const freq: Map<string, number> = new Map();
  for (const c of tiles) {
    freq.set(c, (freq.get(c) ?? 0) + 1);
  }
  // 将 Map 转为数组方便遍历
  const letters: string[] = Array.from(freq.keys());
  const counts: number[] = letters.map((c) => freq.get(c) as number);

  let total = 0;

  const backtrack = (): void => {
    for (let i = 0; i < letters.length; i++) {
      if (counts[i] === 0) continue;
      // 选择字母 letters[i]，构成一个新序列
      total++;
      counts[i]--;
      backtrack();
      counts[i]++;
    }
  };

  backtrack();
  return total;
}

// 方法2：回溯 + 去重
// 排序后逐位选字符，跳过同层重复，统计所有非空排列
// 时间复杂度 O(N!), 空间复杂度 O(N)
function numTilePossibilities2(tiles: string): number {
  const arr: string[] = tiles.split("").sort();
  const n = arr.length;
  const used: boolean[] = new Array(n).fill(false);
  let total = 0;

  const backtrack = (): void => {
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      // 同层去重
      if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) continue;
      total++;
      used[i] = true;
      backtrack();
      used[i] = false;
    }
  };

  backtrack();
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 活字印刷 =====");
console.log(numTilePossibilities("AAB")); // 期望结果: 8
console.log(numTilePossibilities("AAABBC")); // 期望结果: 188
console.log(numTilePossibilities2("AAB")); // 期望结果: 8
console.log(numTilePossibilities2("AAABBC")); // 期望结果: 188

export {};
