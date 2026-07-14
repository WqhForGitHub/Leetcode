// ============================================================
// 005. 电话号码的字母组合
// ============================================================
// LeetCode 17. Letter Combinations of a Phone Number
// 给定数字字符串，返回所有可能的字母组合。哈希表存数字-字母映射，回溯。
// 时间复杂度：O(4^n)，空间复杂度：O(n)

function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];
  const phoneMap = new Map<string, string>([
    ["2", "abc"],
    ["3", "def"],
    ["4", "ghi"],
    ["5", "jkl"],
    ["6", "mno"],
    ["7", "pqrs"],
    ["8", "tuv"],
    ["9", "wxyz"],
  ]);
  const result: string[] = [];
  const path: string[] = [];

  const backtrack = (index: number): void => {
    if (index === digits.length) {
      result.push(path.join(""));
      return;
    }
    const letters = phoneMap.get(digits[index])!;
    for (const letter of letters) {
      path.push(letter);
      backtrack(index + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 电话号码的字母组合 =====");
console.log("测试1:", letterCombinations("23")); // 预期: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log("测试2:", letterCombinations("")); // 预期: []
console.log("测试3:", letterCombinations("2")); // 预期: ["a","b","c"]

export {};
