// ============================================================
// 072. 口算难题
// ============================================================
// LeetCode 1307. Verbal Arithmetic Puzzle
// 给定 words 和 result，给每个字母分配 0-9 中不同的数字，前导字母不能为 0，
// 使得 sum(words) = result 成立。判断是否存在这样的分配方案。
// 时间复杂度：最坏 O(10!)，但剪枝后实际很快。

// 方法1：回溯(列优先+进位) (推荐)
// 从右到左逐列处理，对每列未分配字母尝试不同数字，
// 利用列方程（含进位）强约束进行剪枝，效率较高。
// 时间复杂度：剪枝后远小于 O(10!)，空间复杂度：O(字母数)
function isSolvable1(words: string[], result: string): boolean {
  // 收集所有字母
  const allChars: Set<string> = new Set();
  for (const w of words) for (const c of w) allChars.add(c);
  for (const c of result) allChars.add(c);
  if (allChars.size > 10) return false; // 字母超过 10 个无解

  // 任意 word 不能比 result 更长（否则和必大于 result）
  for (const w of words) {
    if (w.length > result.length) return false;
  }

  // 前导字母不能为 0
  const firstChars: Set<string> = new Set();
  for (const w of words) if (w.length > 1) firstChars.add(w[0]);
  if (result.length > 1) firstChars.add(result[0]);

  const maxLen: number = result.length;

  // 为每一列准备字母：col[i] = { wordLetters, resultLetter }
  type Column = { wordLetters: string[]; resultLetter: string | null };
  const cols: Column[] = [];
  for (let i: number = 0; i < maxLen; i++) {
    const wordLetters: string[] = [];
    for (const w of words) {
      const pos: number = w.length - 1 - i;
      if (pos >= 0) wordLetters.push(w[pos]);
    }
    const rPos: number = result.length - 1 - i;
    const resultLetter: string | null = rPos >= 0 ? result[rPos] : null;
    cols.push({ wordLetters, resultLetter });
  }

  const assign: Map<string, number> = new Map();
  const used: boolean[] = new Array(10).fill(false);

  // 列优先回溯：colIdx 当前列，carry 来自上一列的进位
  const backtrack = (colIdx: number, carry: number): boolean => {
    if (colIdx === maxLen) {
      // 处理完所有列，进位必须为 0（否则 result 还需更长的位数）
      return carry === 0;
    }
    const col: Column = cols[colIdx];

    // 收集本列中未分配的 word 字母（去重）
    const unassigned: string[] = [];
    const seen: Set<string> = new Set();
    for (const c of col.wordLetters) {
      if (!assign.has(c) && !seen.has(c)) {
        unassigned.push(c);
        seen.add(c);
      }
    }

    // 对未分配的 word 字母尝试不同的数字
    const tryAssign = (idx: number): boolean => {
      if (idx === unassigned.length) {
        // 本列 word 字母均已分配，校验列方程
        let sum: number = carry;
        for (const c of col.wordLetters) sum += assign.get(c)!;
        const rDigit: number = sum % 10;
        const newCarry: number = Math.floor(sum / 10);
        if (col.resultLetter === null) return false;

        if (assign.has(col.resultLetter)) {
          // result 字母已分配（可能也出现在 word 中），校验一致性
          if (assign.get(col.resultLetter) !== rDigit) return false;
          return backtrack(colIdx + 1, newCarry);
        } else {
          // result 字母未分配，必须取 rDigit
          if (used[rDigit]) return false;
          if (rDigit === 0 && firstChars.has(col.resultLetter)) return false;
          assign.set(col.resultLetter, rDigit);
          used[rDigit] = true;
          const ok: boolean = backtrack(colIdx + 1, newCarry);
          used[rDigit] = false;
          assign.delete(col.resultLetter);
          return ok;
        }
      }
      const c: string = unassigned[idx];
      for (let d: number = 0; d < 10; d++) {
        if (used[d]) continue;
        if (d === 0 && firstChars.has(c)) continue;
        assign.set(c, d);
        used[d] = true;
        if (tryAssign(idx + 1)) return true;
        used[d] = false;
        assign.delete(c);
      }
      return false;
    };

    return tryAssign(0);
  };

  return backtrack(0, 0);
}

// 方法2：回溯(字母优先+剪枝)
// 对每个字母计算其系数（在 words 中权重为 +10^pos，在 result 中为 -10^pos）。
// 所有 系数*数字 之和必须为 0。按系数绝对值从大到小排序，做剪枝。
// 时间复杂度：最坏 O(10!)，剪枝后通常很快。空间复杂度：O(字母数)
function isSolvable2(words: string[], result: string): boolean {
  // 计算每个字母的系数
  const coeff: Map<string, number> = new Map();
  const addCoeff = (c: string, w: number): void => {
    coeff.set(c, (coeff.get(c) ?? 0) + w);
  };
  for (const w of words) {
    for (let i: number = 0; i < w.length; i++) {
      const pos: number = w.length - 1 - i;
      addCoeff(w[i], Math.pow(10, pos));
    }
  }
  for (let i: number = 0; i < result.length; i++) {
    const pos: number = result.length - 1 - i;
    addCoeff(result[i], -Math.pow(10, pos));
  }

  if (coeff.size > 10) return false;
  for (const w of words) {
    if (w.length > result.length) return false;
  }

  // 按系数绝对值从大到小排序（让剪枝更早生效）
  const letters: string[] = [...coeff.keys()];
  letters.sort((a: string, b: string) => Math.abs(coeff.get(b)!) - Math.abs(coeff.get(a)!));

  const firstChars: Set<string> = new Set();
  for (const w of words) if (w.length > 1) firstChars.add(w[0]);
  if (result.length > 1) firstChars.add(result[0]);

  // 后缀系数绝对值之和（最大可能贡献），用于剪枝
  const suffixMax: number[] = new Array(letters.length + 1).fill(0);
  for (let i: number = letters.length - 1; i >= 0; i--) {
    suffixMax[i] = suffixMax[i + 1] + Math.abs(coeff.get(letters[i])!) * 9;
  }

  const used: boolean[] = new Array(10).fill(false);

  const backtrack = (idx: number, sum: number): boolean => {
    if (idx === letters.length) {
      return sum === 0;
    }
    // 剪枝：若 |当前和| 已超出剩余字母可贡献的最大幅度，则不可能归零
    if (Math.abs(sum) > suffixMax[idx]) return false;

    const c: string = letters[idx];
    const w: number = coeff.get(c)!;
    for (let d: number = 0; d < 10; d++) {
      if (used[d]) continue;
      if (d === 0 && firstChars.has(c)) continue;
      used[d] = true;
      if (backtrack(idx + 1, sum + w * d)) return true;
      used[d] = false;
    }
    return false;
  };

  return backtrack(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 口算难题 =====");
console.log(isSolvable1(["SEND", "MORE"], "MONEY")); // 期望结果: true
console.log(isSolvable1(["SIX", "SEVEN", "SEVEN"], "TWENTY")); // 期望结果: true
console.log(isSolvable1(["LEET", "LEET"], "CODE")); // 期望结果: false
console.log(isSolvable1(["THIS", "IS", "TOO"], "FUNNY")); // 期望结果: true
console.log(isSolvable2(["SEND", "MORE"], "MONEY")); // 期望结果: true
console.log(isSolvable2(["SIX", "SEVEN", "SEVEN"], "TWENTY")); // 期望结果: true
console.log(isSolvable2(["LEET", "LEET"], "CODE")); // 期望结果: false

export {};
