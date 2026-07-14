// ============================================================
// 001. 电话号码的字母组合
// ============================================================
// LeetCode 17. Letter Combinations of a Phone Number
// 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
// 数字到字母的映射与电话按键相同（2->abc, 3->def, ...）。
// 时间复杂度：O(4^n * n)，其中 4 是含 4 个字母的按键数量，n 是数字长度

// 方法1：回溯DFS（推荐）
// 通过深度优先搜索枚举每一位数字对应的所有字母
// 时间复杂度 O(4^n * n)，空间复杂度 O(n) 递归栈
function letterCombinations(digits: string): string[] {
  const result: string[] = [];
  // 空字符串直接返回空数组
  if (digits.length === 0) {
    return result;
  }
  // 数字到字母的映射表
  const phoneMap: Record<string, string> = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  // 回溯函数：index 表示当前处理到的数字下标
  const backtrack = (index: number, path: string): void => {
    // 当路径长度等于数字长度时，收集结果
    if (index === digits.length) {
      result.push(path);
      return;
    }
    const letters: string = phoneMap[digits[index]];
    for (let i = 0; i < letters.length; i++) {
      backtrack(index + 1, path + letters[i]);
    }
  };

  backtrack(0, "");
  return result;
}

// 方法2：迭代BFS/队列
// 使用队列，逐位扩展已有的组合
// 时间复杂度 O(4^n * n)，空间复杂度 O(4^n)
function letterCombinationsBFS(digits: string): string[] {
  if (digits.length === 0) {
    return [];
  }
  const phoneMap: Record<string, string> = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };
  // 初始化队列，包含一个空字符串
  let queue: string[] = [""];
  // 逐位扩展
  for (let i = 0; i < digits.length; i++) {
    const letters: string = phoneMap[digits[i]];
    const nextQueue: string[] = [];
    for (const combination of queue) {
      for (let j = 0; j < letters.length; j++) {
        nextQueue.push(combination + letters[j]);
      }
    }
    queue = nextQueue;
  }
  return queue;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 电话号码的字母组合 =====");
console.log(letterCombinations("23")); // 期望结果: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log(letterCombinations("")); // 期望结果: []
console.log(letterCombinations("2")); // 期望结果: ["a","b","c"]
console.log(letterCombinationsBFS("23")); // 期望结果: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log(letterCombinationsBFS("")); // 期望结果: []
console.log(letterCombinationsBFS("9")); // 期望结果: ["w","x","y","z"]

export {};
