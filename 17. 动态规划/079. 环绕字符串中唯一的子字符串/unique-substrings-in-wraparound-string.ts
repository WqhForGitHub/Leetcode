// ============================================================
// 079. 环绕字符串中唯一的子字符串
// ============================================================
// LeetCode 467. Unique Substrings in Wraparound String
// 基础字符串是 abcd...zabcd...z 无限循环。
// 给定字符串 p，返回 p 中有多少不同的非空子串在基础字符串中出现。
// 时间复杂度：O(n)，空间复杂度：O(26)

// 方法1：DP（推荐）
// dp[char] = 以该字符结尾的最长合法子串长度
// 合法子串：相邻字符差为1（或 'z'->'a'）
// 时间复杂度 O(n)，空间复杂度 O(26)
function findSubstringInWraproundString(p: string): number {
  if (p.length === 0) return 0;

  // dp[i] 表示以字符 i 结尾的最长合法子串长度
  const dp: number[] = new Array(26).fill(0);

  // 当前连续合法子串的长度
  let maxLen: number = 1;
  dp[p.charCodeAt(0) - 97] = 1;

  for (let i: number = 1; i < p.length; i++) {
    const prev: number = p.charCodeAt(i - 1) - 97;
    const curr: number = p.charCodeAt(i) - 97;

    // 检查是否连续：(curr - prev + 26) % 26 === 1
    if ((curr - prev + 26) % 26 === 1) {
      maxLen++;
    } else {
      maxLen = 1;
    }

    // 更新以当前字符结尾的最长长度
    dp[curr] = Math.max(dp[curr], maxLen);
  }

  // 所有以每个字符结尾的合法子串长度之和
  let result: number = 0;
  for (let i: number = 0; i < 26; i++) {
    result += dp[i];
  }

  return result;
}

// 方法2：DP + 集合去重
// 直接收集所有合法子串的结尾字符和长度
// 时间复杂度 O(n)，空间复杂度 O(26)
function findSubstringInWraproundString2(p: string): number {
  if (p.length === 0) return 0;

  // maxLen[i] = 以字符 i+'a' 结尾的最长合法子串长度
  const maxLen: number[] = new Array(26).fill(0);
  let len: number = 1;
  maxLen[p.charCodeAt(0) - 97] = 1;

  for (let i: number = 1; i < p.length; i++) {
    const diff: number = p.charCodeAt(i) - p.charCodeAt(i - 1);
    // 合法条件：差为1或-25（z->a）
    if (diff === 1 || diff === -25) {
      len++;
    } else {
      len = 1;
    }
    const idx: number = p.charCodeAt(i) - 97;
    maxLen[idx] = Math.max(maxLen[idx], len);
  }

  return maxLen.reduce((sum: number, val: number) => sum + val, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 环绕字符串中唯一的子字符串 =====");
console.log(findSubstringInWraproundString("a")); // 期望结果: 1
console.log(findSubstringInWraproundString("cac")); // 期望结果: 2
console.log(findSubstringInWraproundString("zab")); // 期望结果: 6
console.log(findSubstringInWraproundString("zabczab")); // 期望结果: 27
console.log("--- 方法2测试 ---");
console.log(findSubstringInWraproundString2("a")); // 期望结果: 1
console.log(findSubstringInWraproundString2("zab")); // 期望结果: 6

export {};
