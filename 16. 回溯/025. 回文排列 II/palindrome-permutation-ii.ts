// ============================================================
// 025. 回文排列 II
// ============================================================
// LeetCode 267. Palindrome Permutation II
// 给定字符串，返回所有可能的回文排列。如果无法构成回文排列则返回空列表。
// 时间复杂度：O((N/2)!)，空间复杂度：O(N)

// 方法1：回溯（取一半字符排列） (推荐)
// 首先统计字符频率，验证是否能构成回文（最多一个奇数频率字符）
// 然后取一半字符进行排列，加上中间字符（如果有）和反向的半边
// 时间复杂度 O((N/2)!), 空间复杂度 O(N)
function generatePalindromes(s: string): string[] {
  // 统计字符频率
  const charCount: Map<string, number> = new Map();
  for (const ch of s) {
    charCount.set(ch, (charCount.get(ch) || 0) + 1);
  }

  // 检查是否能构成回文：最多一个字符出现奇数次
  let oddChar: string = "";
  let oddCount: number = 0;
  const halfChars: string[] = [];

  for (const [ch, count] of charCount) {
    if (count % 2 === 1) {
      oddChar = ch;
      oddCount++;
    }
    // 取一半字符
    for (let i = 0; i < Math.floor(count / 2); i++) {
      halfChars.push(ch);
    }
  }

  // 如果有超过一个奇数频率字符，无法构成回文
  if (oddCount > 1) return [];

  // 对半边字符进行排列，生成所有回文
  const result: string[] = [];
  const used: boolean[] = new Array(halfChars.length).fill(false);

  function backtrack(path: string[]): void {
    if (path.length === halfChars.length) {
      const half: string = path.join("");
      const full: string = half + oddChar + half.split("").reverse().join("");
      result.push(full);
      return;
    }

    for (let i = 0; i < halfChars.length; i++) {
      // 跳过已使用的
      if (used[i]) continue;
      // 跳过重复（避免生成相同排列）
      if (i > 0 && halfChars[i] === halfChars[i - 1] && !used[i - 1]) continue;

      used[i] = true;
      path.push(halfChars[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return result;
}

// 方法2：回溯 + 字符频率
// 不预先提取半边字符数组，而是直接在频率表上操作
// 时间复杂度 O((N/2)!), 空间复杂度 O(N)
function generatePalindromes2(s: string): string[] {
  // 统计字符频率
  const charCount: Map<string, number> = new Map();
  for (const ch of s) {
    charCount.set(ch, (charCount.get(ch) || 0) + 1);
  }

  // 检查奇数频率字符
  let oddChar: string = "";
  let oddCount: number = 0;
  let halfLength: number = 0;

  for (const [ch, count] of charCount) {
    if (count % 2 === 1) {
      oddChar = ch;
      oddCount++;
    }
    halfLength += Math.floor(count / 2);
  }

  if (oddCount > 1) return [];

  // 将频率减半
  for (const [ch, count] of charCount) {
    charCount.set(ch, Math.floor(count / 2));
  }

  const result: string[] = [];
  const path: string[] = [];

  function backtrack(): void {
    if (path.length === halfLength) {
      const half: string = path.join("");
      const full: string = half + oddChar + half.split("").reverse().join("");
      result.push(full);
      return;
    }

    // 遍历所有可用字符（按键排序保证顺序一致）
    const sortedChars: string[] = [...charCount.keys()].sort();
    for (const ch of sortedChars) {
      if (charCount.get(ch)! > 0) {
        path.push(ch);
        charCount.set(ch, charCount.get(ch)! - 1);
        backtrack();
        path.pop();
        charCount.set(ch, charCount.get(ch)! + 1);
      }
    }
  }

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 回文排列 II =====");
console.log(generatePalindromes("aabb")); // 期望结果: ["abba","baab"]
console.log(generatePalindromes2("aabb")); // 期望结果: ["abba","baab"]
console.log(generatePalindromes("abc")); // 期望结果: []
console.log(generatePalindromes2("abc")); // 期望结果: []
console.log(generatePalindromes("a")); // 期望结果: ["a"]
console.log(generatePalindromes2("a")); // 期望结果: ["a"]
console.log(generatePalindromes("aaabbbb")); // 期望结果: ["abababa","abbabba","baabaab","babaaba","bbbaabb"]（或顺序不同）

export {};
