// ============================================================
// 043. 回文排列 II
// ============================================================
// LeetCode 267. Palindrome Permutation II
// 给定字符串 s，返回所有能排列成回文串的方案（不重复）。
// 时间复杂度：O((n/2)!)，空间复杂度：O(n)

function generatePalindromes(s: string): string[] {
  // 1. 哈希表统计字符出现次数
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // 2. 检查能否组成回文：奇数次字符至多一个
  let oddChar = "";
  const half: string[] = [];
  for (const [ch, cnt] of count) {
    if (cnt % 2 !== 0) {
      if (oddChar !== "") return []; // 已经有一个奇数次字符，无法组成回文
      oddChar = ch;
    }
    // 取一半数量的字符用于回溯生成全排列
    const halfCount = Math.floor(cnt / 2);
    for (let i = 0; i < halfCount; i++) half.push(ch);
  }

  // 3. 回溯生成前半部分的全排列
  const result: string[] = [];
  const used: boolean[] = new Array(half.length).fill(false);
  const path: string[] = [];

  // 先排序便于去重
  half.sort();

  const backtrack = (): void => {
    if (path.length === half.length) {
      const left = path.join("");
      const right = left.split("").reverse().join("");
      result.push(left + oddChar + right);
      return;
    }
    for (let i = 0; i < half.length; i++) {
      // 去重：相同字符只在前一个被使用时才使用
      if (used[i]) continue;
      if (i > 0 && half[i] === half[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(half[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 回文排列 II =====");
console.log(generatePalindromes("aabb")); // ["abba","baab"]
console.log(generatePalindromes("abc")); // []
console.log(generatePalindromes("a")); // ["a"]
console.log(generatePalindromes("aaa")); // ["aaa"]

export {};
