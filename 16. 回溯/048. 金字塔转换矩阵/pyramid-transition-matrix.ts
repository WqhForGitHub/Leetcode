// ============================================================
// 048. 金字塔转换矩阵
// ============================================================
// LeetCode 756. Pyramid Transition Matrix
// 给定底层字符串 bottom 和允许的三元组 allowed（[left, right, top]），
// 判断能否从底层逐层向上构建，直到顶层只剩一个字符。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(逐层构建) (推荐)
// 对当前层每一对相邻字符，找出所有可能的顶部字符，组合出下一层，递归判断。
// 时间复杂度 O(7^l * l) 其中 l 为层数, 空间复杂度 O(l)
function pyramidTransition(bottom: string, allowed: string[][]): boolean {
  // 构建映射：key = left+right, value = 可选的top字符列表
  const map = new Map<string, string[]>();
  for (const triple of allowed) {
    const [l, r, t] = triple;
    const key = l + r;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }

  // 给定当前层，尝试构建下一层
  const build = (current: string): boolean => {
    if (current.length === 1) return true; // 顶层只剩一个字符

    // 收集每对相邻字符的可选top列表
    const candidates: string[][] = [];
    for (let i = 0; i < current.length - 1; i++) {
      const key = current[i] + current[i + 1];
      if (!map.has(key)) return false; // 这一对没有合法top，无法构建
      candidates.push(map.get(key)!);
    }

    // 回溯：在每对字符的可选top中选一个，组合成下一层
    const next: string[] = [];
    const n = candidates.length;

    const backtrack = (idx: number): boolean => {
      if (idx === n) {
        return build(next.join(""));
      }
      for (const ch of candidates[idx]) {
        next.push(ch);
        if (backtrack(idx + 1)) return true;
        next.pop();
      }
      return false;
    };

    return backtrack(0);
  };

  return build(bottom);
}

// 方法2：回溯+预处理映射
// 使用更紧凑的字符串编码和集合，原理类似但使用更高效的查找结构。
// 时间复杂度 O(7^l * l), 空间复杂度 O(|allowed| + l)
function pyramidTransitionOptimized(bottom: string, allowed: string[][]): boolean {
  // 使用 Map<string, Set<string>> 加速查找
  const map = new Map<string, Set<string>>();
  for (const [l, r, t] of allowed) {
    const key = l + r;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(t);
  }

  const memo = new Map<string, boolean>();

  const buildNext = (current: string): boolean => {
    if (current.length === 1) return true;
    // 记忆化
    if (memo.has(current)) return memo.get(current)!;

    const candidates: string[][] = [];
    for (let i = 0; i < current.length - 1; i++) {
      const key = current[i] + current[i + 1];
      const set = map.get(key);
      if (!set || set.size === 0) {
        memo.set(current, false);
        return false;
      }
      candidates.push(Array.from(set));
    }

    const next: string[] = [];
    const n = candidates.length;

    const backtrack = (idx: number): boolean => {
      if (idx === n) {
        return buildNext(next.join(""));
      }
      for (const ch of candidates[idx]) {
        next.push(ch);
        if (backtrack(idx + 1)) return true;
        next.pop();
      }
      return false;
    };

    const result = backtrack(0);
    memo.set(current, result);
    return result;
  };

  return buildNext(bottom);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 金字塔转换矩阵 =====");
// "BCD": 对 (C,D) 无映射，无法构建下一层 -> false
console.log(
  pyramidTransition("BCD", [
    ["B", "C", "D"],
    ["B", "C", "A"],
    ["A", "B", "D"],
    ["D", "C", "B"],
  ]),
); // 期望结果: false
console.log(pyramidTransition("AAAA", [["A", "A", "A"]])); // 期望结果: true
console.log(
  pyramidTransitionOptimized("BCD", [
    ["B", "C", "D"],
    ["B", "C", "A"],
    ["A", "B", "D"],
    ["D", "C", "B"],
  ]),
); // 期望结果: false
console.log(pyramidTransitionOptimized("AAAA", [["A", "A", "A"]])); // 期望结果: true

export {};
