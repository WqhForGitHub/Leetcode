// ============================================================
// 010. 字符串中的第一个唯一字符
// ============================================================
// LeetCode 387. First Unique Character in a String
// 给定一个字符串 s，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。

// ------------------------------------------------------------
// 方法1：哈希计数 + 二次遍历
// ------------------------------------------------------------
// 第一次遍历统计每个字符出现次数，第二次遍历找到第一个计数为 1 的字符。
// 时间 O(n)，空间 O(1)（26 个字母）。
function firstUniqChar1(s: string): number {
  const count: Record<string, number> = {};
  for (const ch of s) {
    count[ch] = (count[ch] || 0) + 1;
  }
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) {
      return i;
    }
  }
  return -1;
}

// ------------------------------------------------------------
// 方法2：队列（首次出现 + 去重）
// ------------------------------------------------------------
// 用队列按序保存候选唯一字符及其首次出现位置，用 Map 记录计数。
// 遍历时更新计数，并清理队首重复字符。
// 时间 O(n)，空间 O(1)。
function firstUniqChar2(s: string): number {
  const count: Map<string, number> = new Map();
  const queue: { ch: string; index: number }[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    count.set(ch, (count.get(ch) || 0) + 1);
    queue.push({ ch, index: i });
    while (queue.length > 0 && count.get(queue[0].ch)! > 1) {
      queue.shift();
    }
  }
  return queue.length > 0 ? queue[0].index : -1;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", firstUniqChar1("leetcode"), "期望: 0");
  console.log("测试2:", firstUniqChar1("loveleetcode"), "期望: 2");
  console.log("测试3:", firstUniqChar1("aabb"), "期望: -1");
  console.log("测试4:", firstUniqChar2("leetcode"), "期望: 0");
  console.log("测试5:", firstUniqChar2("loveleetcode"), "期望: 2");
  console.log("测试6:", firstUniqChar2("aabb"), "期望: -1");
}

test();

export {};
