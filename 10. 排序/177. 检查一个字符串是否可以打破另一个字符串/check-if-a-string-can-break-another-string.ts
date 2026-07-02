// ============================================================
// 177. 检查一个字符串是否可以打破另一个字符串
// ============================================================
// LeetCode 1433. Check If a String Can Break Another String
// 给定两个长度相同的字符串 s1 和 s2，可任意重排。
// 若存在排列使 s1[i] >= s2[i] 对所有 i 成立，则 s1 打破 s2。
// 反之亦然。判断是否存在某一方打破另一方。

// 方法1：排序 + 单方向比较（O(n log n)）
// 排序后先尝试 s1 打破 s2，若失败再尝试 s2 打破 s1。
function checkIfCanBreak(s1: string, s2: string): boolean {
  const a1 = s1.split("").sort();
  const a2 = s2.split("").sort();
  const n = a1.length;
  // 尝试 s1 打破 s2
  let s1Wins = true;
  for (let i = 0; i < n; i++) {
    if (a1[i] < a2[i]) {
      s1Wins = false;
      break;
    }
  }
  if (s1Wins) return true;
  // 尝试 s2 打破 s1
  for (let i = 0; i < n; i++) {
    if (a2[i] < a1[i]) return false;
  }
  return true;
}

// 方法2：排序 + 一次遍历检查两个方向（O(n log n)）
// 同时维护两个标志，一次遍历判断两个方向是否可行。
function checkIfCanBreak2(s1: string, s2: string): boolean {
  const a1 = s1.split("").sort();
  const a2 = s2.split("").sort();
  const n = a1.length;
  let s1BreaksS2 = true;
  let s2BreaksS1 = true;
  for (let i = 0; i < n; i++) {
    if (a1[i] < a2[i]) s1BreaksS2 = false;
    if (a2[i] < a1[i]) s2BreaksS1 = false;
    if (!s1BreaksS2 && !s2BreaksS1) return false;
  }
  return s1BreaksS2 || s2BreaksS1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 177. 检查一个字符串是否可以打破另一个字符串 =====");
console.log("方法1 s1=abc s2=xya:", checkIfCanBreak("abc", "xya")); // true
console.log("方法1 s1=abe s2=acd:", checkIfCanBreak("abe", "acd")); // false
console.log("方法1 s1=leetcode s2=inte:", checkIfCanBreak("leetcode", "inte")); // true
console.log("方法2 s1=abc s2=xya:", checkIfCanBreak2("abc", "xya")); // true
console.log("方法2 s1=abe s2=acd:", checkIfCanBreak2("abe", "acd")); // false
console.log("方法2 s1=leetcode s2=inte:", checkIfCanBreak2("leetcode", "inte")); // true

export {};
