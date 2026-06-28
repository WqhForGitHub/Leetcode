// ============================================================
// 068. 赎金信
// ============================================================
// LeetCode 383. Ransom Note
// 判断 ransomNote 能否由 magazine 中的字母构成（magazine 中每个字母只能用一次）。
// 时间复杂度：O(M + N)，M、N 分别为两串长度
// 空间复杂度：O(1)（仅小写字母，常数空间）

function canConstruct(ransomNote: string, magazine: string): boolean {
  // 哈希表统计 magazine 中各字符可用次数
  const count = new Map<string, number>();
  for (const ch of magazine) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // 逐字符消费 ransomNote
  for (const ch of ransomNote) {
    const remain = count.get(ch) ?? 0;
    if (remain <= 0) {
      return false; // 该字符不够用
    }
    count.set(ch, remain - 1);
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 赎金信 =====");

// 测试 1：可以构成
// 期望 true
console.log("test1:", canConstruct("aa", "aab")); // true

// 测试 2：字符不足
// 期望 false
console.log("test2:", canConstruct("aa", "ab")); // false

// 测试 3：完全相同
// 期望 true
console.log("test3:", canConstruct("abc", "abc")); // true

// 测试 4：magazine 字符充足，可构成
// 期望 true
console.log("test4:", canConstruct("big", "hjibagacb")); // true

export {};
