// ============================================================
// 062. 招式拆解 II
// ============================================================
// LeetCode LCR 032 / 剑指 Offer 50. 第一个只出现一次的字符
// 在字符串 s 中找出第一个只出现一次的字符，并返回它的位置。如果不存在，则返回 -1。

// ------------------------------------------------------------
// 方法1：哈希计数 + 二次遍历
// ------------------------------------------------------------
// 第一次遍历统计字符频次，第二次遍历找第一个频次为 1 的字符。
// 时间 O(n)，空间 O(1)。
function dismantlingAction1(s: string): number {
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
// 方法2：队列 + 计数
// ------------------------------------------------------------
// 用队列保存候选唯一字符及其首次出现位置，遍历时清理队首重复字符。
// 时间 O(n)，空间 O(1)。
function dismantlingAction2(s: string): number {
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
  console.log("测试1:", dismantlingAction1("leetcode"), "期望: 0");
  console.log("测试2:", dismantlingAction1("loveleetcode"), "期望: 2");
  console.log("测试3:", dismantlingAction1("aabb"), "期望: -1");
  console.log("测试4:", dismantlingAction2("leetcode"), "期望: 0");
  console.log("测试5:", dismantlingAction2("loveleetcode"), "期望: 2");
  console.log("测试6:", dismantlingAction2("aabb"), "期望: -1");
}

test();

export {};
