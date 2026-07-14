// ============================================================
// 069. 字符串中的第一个唯一字符
// ============================================================
// LeetCode 387. First Unique Character in a String
// 找到字符串中第一个只出现一次的字符的索引，若不存在返回 -1。
// 时间复杂度：O(N)
// 空间复杂度：O(1)（仅小写字母）

function firstUniqChar(s: string): number {
  // 哈希表统计每个字符出现次数
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // 再次遍历，找到第一个计数为 1 的字符
  for (let i = 0; i < s.length; i++) {
    if (count.get(s[i]) === 1) {
      return i;
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 字符串中的第一个唯一字符 =====");

// 测试 1：leetc... 中 'l' 唯一
// 期望 0
console.log("test1:", firstUniqChar("leetcode")); // 0

// 测试 2：loveleetcode 中 'v' 是第一个唯一字符
// 期望 2
console.log("test2:", firstUniqChar("loveleetcode")); // 2

// 测试 3：所有字符都重复
// 期望 -1
console.log("test3:", firstUniqChar("aabb")); // -1

// 测试 4：单字符
// 期望 0
console.log("test4:", firstUniqChar("z")); // 0

export {};
