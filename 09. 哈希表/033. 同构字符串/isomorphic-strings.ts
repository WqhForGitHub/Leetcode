// ============================================================
// 033. 同构字符串
// ============================================================
// LeetCode 205. Isomorphic Strings
// 判断两字符串是否同构。双向哈希映射。
// 时间复杂度：O(n)，空间复杂度：O(1)（字符集大小固定）

/**
 * 使用双向哈希映射判断同构
 * s -> t 的映射和 t -> s 的映射必须一致
 * 同一字符只能映射到唯一字符
 */
function isIsomorphic(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const sToT = new Map<string, string>();
  const tToS = new Map<string, string>();

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];

    // 检查 s -> t 映射
    if (sToT.has(charS)) {
      if (sToT.get(charS) !== charT) return false;
    } else {
      sToT.set(charS, charT);
    }

    // 检查 t -> s 映射
    if (tToS.has(charT)) {
      if (tToS.get(charT) !== charS) return false;
    } else {
      tToS.set(charT, charS);
    }
  }

  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 同构字符串 =====");
// 测试 1: egg 与 add 同构
console.log(isIsomorphic("egg", "add")); // 期望输出: true

// 测试 2: foo 与 bar 不同构
console.log(isIsomorphic("foo", "bar")); // 期望输出: false

// 测试 3: paper 与 title 同构
console.log(isIsomorphic("paper", "title")); // 期望输出: true

// 测试 4: badc 与 baba 不同构
console.log(isIsomorphic("badc", "baba")); // 期望输出: false

export {};
