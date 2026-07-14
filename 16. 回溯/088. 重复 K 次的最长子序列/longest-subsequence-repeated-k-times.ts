// ============================================================
// 088. 重复 K 次的最长子序列
// ============================================================
// LeetCode 2014. Longest Subsequence Repeated k Times
// 给定字符串 s 和整数 k，找出最长的子序列 sub，使得 sub 重复 k 次（即 sub*k）仍是 s 的子序列。
// 若有多个相同长度，返回字典序最大者。
// 时间复杂度：O(n * 7^7)（n <= k*7*7），空间复杂度：O(n)

// 方法1：回溯 (BFS+验证)
// 由长度递减 BFS 生成候选子序列，并用子序列匹配验证 sub*k 是否为 s 的子序列。
// 时间复杂度 O(n * 7^7), 空间复杂度 O(n)
function longestSubsequenceRepeatedK(s: string, k: number): string {
  const _n: number = s.length;
  // 频次过滤：每个字符至少出现 k 次才能进入候选
  const freq: Record<string, number> = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  const candidates: string[] = [];
  for (const ch of Object.keys(freq)) {
    if (freq[ch] >= k) candidates.push(ch);
  }
  candidates.sort((a, b) => (a < b ? 1 : -1)); // 字典序降序

  // BFS 从长到短：先扩展长度为 1 的所有候选
  let queue: string[] = [...candidates];
  let answer: string = "";

  // 检查 sub * k 是否为 s 的子序列
  const isSubsequence = (sub: string): boolean => {
    const target: string = sub.repeat(k);
    let i: number = 0;
    for (const ch of s) {
      if (i < target.length && ch === target[i]) i++;
    }
    return i === target.length;
  };

  while (queue.length > 0) {
    const next: string[] = [];
    for (const cur of queue) {
      if (isSubsequence(cur)) {
        // 当前 cur 是合法子序列：若更长，或同长但字典序更大，则更新答案
        if (cur.length > answer.length || (cur.length === answer.length && cur > answer)) {
          answer = cur;
        }
        // 继续扩展尝试更长的解
        for (const c of candidates) {
          next.push(cur + c);
        }
      }
    }
    queue = next;
  }
  return answer;
}

// 方法2：回溯+剪枝
// 直接按位回溯构建候选子序列，按字典序降序枚举字符，找到第一个满足条件的最长子序列。
// 时间复杂度 O(7^7 * n), 空间复杂度 O(n)
function longestSubsequenceRepeatedK2(s: string, k: number): string {
  const n: number = s.length;
  const freq: Record<string, number> = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  // 候选字符按字典序降序，方便回溯时优先选择字典序大的
  const chars: string[] = Object.keys(freq)
    .filter((c) => freq[c] >= k)
    .sort()
    .reverse();
  // 子序列最长不会超过 n / k
  const maxLen: number = Math.floor(n / k);
  let answer: string = "";

  const isSubsequence = (sub: string): boolean => {
    const target: string = sub.repeat(k);
    let i: number = 0;
    for (const ch of s) {
      if (i < target.length && ch === target[i]) i++;
    }
    return i === target.length;
  };

  // 回溯：从字典序最大开始尝试，cur 当前已构建的字符串
  const backtrack = (cur: string): boolean => {
    if (cur.length > 0) {
      if (!isSubsequence(cur)) return false; // 当前已不合法，再加字符也不会合法
      // 已找到解，记录
      if (cur.length > answer.length) {
        answer = cur;
      }
    }
    if (cur.length === maxLen) return true; // 已达最长，直接返回
    // 尝试每个字符（字典序降序）
    for (const c of chars) {
      const next: string = cur + c;
      // 提前剪枝：next 中字符 c 的次数不能超过 freq[c] / k
      let cnt: number = 0;
      for (const ch of next) if (ch === c) cnt++;
      if (cnt * k > freq[c]) continue;
      backtrack(next);
    }
    return false;
  };

  backtrack("");
  return answer;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 重复 K 次的最长子序列 =====");
console.log(longestSubsequenceRepeatedK("letsleetcode", 2)); // 期望结果: "let"
console.log(longestSubsequenceRepeatedK2("letsleetcode", 2)); // 期望结果: "let"
console.log(longestSubsequenceRepeatedK("bb", 2)); // 期望结果: "b"
console.log(longestSubsequenceRepeatedK2("bb", 2)); // 期望结果: "b"

export {};
