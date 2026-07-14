// ============================================================
// 070. 找不同
// ============================================================
// LeetCode 389. Find the Difference
// 字符串 t 由 s 随机打乱后，在随机位置额外添加一个字符得到。
// 找出 t 中被添加的那个字符。
// 时间复杂度：O(N)
// 空间复杂度：O(1)（仅小写字母）

function findTheDifference(s: string, t: string): string {
  // 哈希表统计 s 中各字符出现次数
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // 遍历 t，逐字符扣减；当某字符不够扣减时即为被添加的字符
  for (const ch of t) {
    const remain = count.get(ch) ?? 0;
    if (remain <= 0) {
      return ch;
    }
    count.set(ch, remain - 1);
  }
  return "";
}

// 附加：异或解法（O(1) 空间，无需哈希表）
// 相同字符异或抵消，最后剩下被添加的字符
function findTheDifferenceXor(s: string, t: string): string {
  let code = 0;
  for (const ch of s) code ^= ch.charCodeAt(0);
  for (const ch of t) code ^= ch.charCodeAt(0);
  return String.fromCharCode(code);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 找不同 =====");

// 测试 1：s = "abcd"，t = "abcde"，添加了 'e'
// 期望 "e"
console.log("test1:", findTheDifference("abcd", "abcde")); // "e"

// 测试 2：s = ""，t = "y"，添加了 'y'
// 期望 "y"
console.log("test2:", findTheDifference("", "y")); // "y"

// 测试 3：添加的是 s 中已存在的字符
// s = "a"，t = "aa"，添加了 'a'
// 期望 "a"
console.log("test3:", findTheDifference("a", "aa")); // "a"

// 测试 4：异或解法验证一致
console.log("test4 xor:", findTheDifferenceXor("abcd", "abcde")); // "e"

export {};
