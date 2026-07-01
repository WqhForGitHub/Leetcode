// ============================================================
// 039. 找不同
// ============================================================
// LeetCode 389. Find the Difference
// 字符串 s 随机打乱后额外加入一个字符得到 t，找出被加入的字符。

// 方法1：异或（推荐，O(n) 时间，O(1) 空间）
// 相同字符异或为 0，所有字符异或后剩下的就是多出的字符。
function findTheDifferenceXOR(s: string, t: string): string {
  let xor = 0;
  for (const ch of s) xor ^= ch.charCodeAt(0);
  for (const ch of t) xor ^= ch.charCodeAt(0);
  return String.fromCharCode(xor);
}

// 方法2：字符计数（O(n) 时间，O(1) 空间）
// 统计 s 中各字符出现次数，遍历 t 时扣减，计数为负即为多出的字符。
function findTheDifferenceCount(s: string, t: string): string {
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }
  for (const ch of t) {
    const c = (count.get(ch) ?? 0) - 1;
    if (c < 0) return ch;
    count.set(ch, c);
  }
  return "";
}

// 方法3：求和差值（O(n) 时间，O(1) 空间）
// t 的字符码之和减去 s 的字符码之和，差值即为多出字符的 ASCII 码。
function findTheDifferenceSum(s: string, t: string): string {
  let sum = 0;
  for (const ch of t) sum += ch.charCodeAt(0);
  for (const ch of s) sum -= ch.charCodeAt(0);
  return String.fromCharCode(sum);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 找不同 =====");

console.log("异或  s=abcd, t=abcde:", findTheDifferenceXOR("abcd", "abcde")); // 期望 "e"
console.log("计数  s=abcd, t=abcde:", findTheDifferenceCount("abcd", "abcde")); // 期望 "e"
console.log("求差  s=abcd, t=abcde:", findTheDifferenceSum("abcd", "abcde")); // 期望 "e"
console.log("异或  s=, t=y:", findTheDifferenceXOR("", "y")); // 期望 "y"
console.log("计数  s=a, t=aa:", findTheDifferenceCount("a", "aa")); // 期望 "a"
console.log("求差  s=ae, t=aea:", findTheDifferenceSum("ae", "aea")); // 期望 "a"

export {};
