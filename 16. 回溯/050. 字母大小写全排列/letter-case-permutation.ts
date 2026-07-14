// ============================================================
// 050. 字母大小写全排列
// ============================================================
// LeetCode 784. Letter Case Permutation
// 给定字符串 s，将每个字母变为小写或大写，数字保持不变，返回所有可能的字符串。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯 (推荐)
// 遍历每个字符，若是字母则在两条分支（小写/大写）上递归。
// 时间复杂度 O(2^n * n), 空间复杂度 O(n) 递归栈深度
function letterCasePermutation(s: string): string[] {
  const result: string[] = [];
  const path: string[] = [];

  const backtrack = (idx: number): void => {
    if (idx === s.length) {
      result.push(path.join(""));
      return;
    }
    const ch = s[idx];
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
      // 小写分支
      path.push(ch.toLowerCase());
      backtrack(idx + 1);
      path.pop();
      // 大写分支
      path.push(ch.toUpperCase());
      backtrack(idx + 1);
      path.pop();
    } else {
      // 数字，直接添加
      path.push(ch);
      backtrack(idx + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// 方法2：迭代
// 从初始字符串开始，每遇到一个字母，复制所有现有结果并改变该位大小写。
// 时间复杂度 O(2^n * n), 空间复杂度 O(2^n * n)
function letterCasePermutationIter(s: string): string[] {
  let result: string[] = [""];
  for (const ch of s) {
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
      const lower = ch.toLowerCase();
      const upper = ch.toUpperCase();
      const newResult: string[] = [];
      for (const r of result) {
        newResult.push(r + lower);
        newResult.push(r + upper);
      }
      result = newResult;
    } else {
      // 数字
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i] + ch;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 字母大小写全排列 =====");
console.log(letterCasePermutation("a1b2")); // 期望结果: ["a1b2","a1B2","A1b2","A1B2"]
console.log(letterCasePermutation("3z4")); // 期望结果: ["3z4","3Z4"]
console.log(letterCasePermutationIter("a1b2")); // 期望结果: ["a1b2","a1B2","A1b2","A1B2"]
console.log(letterCasePermutationIter("3z4")); // 期望结果: ["3z4","3Z4"]

export {};
