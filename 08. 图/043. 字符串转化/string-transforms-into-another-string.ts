// ============================================================
// 043. 字符串转化
// ============================================================
// LeetCode 1153. String Transforms Into Another String
// str1 能否经过若干次"把某字符全部替换为另一字符"变为 str2。
// 约束：同一字符不能映射到两个不同字符；若 str1!=str2 还需存在至少一个未使用字符做中转。
// 时间复杂度：O(n)，空间复杂度：O(|Σ|)

// 方法1：映射图 + 中转字符检查（推荐）
function canConvert(str1: string, str2: string): boolean {
  if (str1 === str2) return true;

  const map = new Map<string, string>(); // str1 字符 -> str2 字符
  const used = new Set<string>(); // str2 中已被映射的字符

  for (let i = 0; i < str1.length; i++) {
    const c1 = str1[i];
    const c2 = str2[i];
    if (map.has(c1)) {
      if (map.get(c1) !== c2) return false; // 同一字符映射到两个不同字符
    } else {
      map.set(c1, c2);
      used.add(c2);
    }
  }

  // str1!=str2 且无冲突时：若 str2 用满 26 个字符则无法找到中转字符
  // 因为所有字符都出现在 str2，任何替换都会破坏 str2 已有结构
  return used.size < 26;
}

// 方法2：显式判断可用中转字符
function canConvertExplicit(str1: string, str2: string): boolean {
  if (str1 === str2) return true;

  const map = new Map<string, string>();
  for (let i = 0; i < str1.length; i++) {
    const c1 = str1[i];
    const c2 = str2[i];
    if (map.has(c1) && map.get(c1) !== c2) return false;
    map.set(c1, c2);
  }

  // 寻找一个不在 str2 中的字符作为中转
  const inStr2 = new Set<string>();
  for (const ch of str2) inStr2.add(ch);
  // 26 个字母全用完则没有中转字符
  return inStr2.size < 26;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 字符串转化 =====");
console.log("canConvert:", canConvert("aabcc", "ccdee")); // 期望 true
console.log("canConvert:", canConvert("leetcode", "programs")); // 期望 false
console.log("canConvert 相同:", canConvert("abc", "abc")); // 期望 true
console.log("canConvert 显式:", canConvertExplicit("aabcc", "ccdee")); // 期望 true
console.log("canConvert 显式:", canConvertExplicit("leetcode", "programs")); // 期望 false
console.log(
  "canConvert 满射:",
  canConvert(
    "abcdefghijklmnopqrstuvwxyz",
    "bcdefghijklmnopqrstuvwxyza",
  ),
); // 期望 false（str2 用满 26 个字符）

export {};
