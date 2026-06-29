// ============================================================
// 143. 金字塔转换矩阵
// ============================================================
// LeetCode 756. Pyramid Transition Matrix
// 给定底层方块 bottom 和允许的规则 allowed（如 "ABC" 表示 A、B 上方可放 C）。
// 判断能否构建金字塔（每层方块由下一层相邻两方块按规则生成）。
// 时间复杂度：O(7^n)，n 为底层长度；空间复杂度：O(n)

function pyramidTransition(bottom: string, allowed: string[]): boolean {
  // 哈希表：左下、右下两个字符 -> 可放的顶部字符列表
  const map = new Map<string, string[]>();
  for (const rule of allowed) {
    const key = rule[0] + rule[1];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(rule[2]);
  }

  // DFS：从当前层构建上一层的所有可能
  const build = (level: string): boolean => {
    if (level.length === 1) return true; // 已到塔顶

    // 找出上一层所有可能的组合
    const candidates: string[][] = [];
    for (let i = 0; i < level.length - 1; i++) {
      const key = level[i] + level[i + 1];
      const tops = map.get(key);
      if (!tops || tops.length === 0) return false; // 无法构建
      candidates.push(tops);
    }
    // 笛卡尔积生成所有可能的上一层
    return dfsNext(candidates, 0, "");
  };

  // 回溯：从 candidates 中各选一个字符组成上一层
  const dfsNext = (candidates: string[][], idx: number, cur: string): boolean => {
    if (idx === candidates.length) {
      return build(cur);
    }
    for (const ch of candidates[idx]) {
      if (dfsNext(candidates, idx + 1, cur + ch)) return true;
    }
    return false;
  };

  return build(bottom);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 143. 金字塔转换矩阵 =====");
console.log(pyramidTransition("BCD", ["BCG", "CDE", "GEA", "FFA"])); // 期望: true
console.log(pyramidTransition("AAAA", ["AAB", "AAC", "BCD", "BBE", "DEF"])); // 期望: false

export {};
