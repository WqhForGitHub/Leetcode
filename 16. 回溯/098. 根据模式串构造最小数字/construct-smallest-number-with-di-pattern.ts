// ============================================================
// 098. 根据模式串构造最小数字
// ============================================================
// LeetCode 2375. Construct Smallest Number With DI Pattern
// 给定 'I'(递增)/'D'(递减) 模式串，构造长度为 pattern.length+1 的最小数字串，
// 使用 1-9 各数字至多一次，且满足模式串描述的相邻位关系。
// 时间复杂度：O(n!), 空间复杂度：O(n) 回溯; O(n) 贪心

// 方法1：回溯
// 从小到大尝试每个数字，确保与上一位满足 I/D 关系，第一个完整方案即为最小。
// 时间复杂度 O(n!) 最坏, 空间复杂度 O(n)
function smallestNumber(pattern: string): string {
  const n: number = pattern.length;
  const used: boolean[] = new Array(10).fill(false);
  let result: string = "";

  const backtrack = (pos: number, prev: number, path: string): boolean => {
    if (pos === n + 1) {
      result = path;
      return true;
    }
    for (let d: number = 1; d <= 9; d++) {
      if (used[d]) continue;
      if (pos > 0) {
        // 检查与上一位的关系
        if (pattern[pos - 1] === "I" && d <= prev) continue;
        if (pattern[pos - 1] === "D" && d >= prev) continue;
      }
      used[d] = true;
      if (backtrack(pos + 1, d, path + d)) return true;
      used[d] = false;
    }
    return false;
  };

  backtrack(0, 0, "");
  return result;
}

// 方法2：贪心+栈 (D 段翻转)
// 依次将数字入栈；遇到 'I' 或末尾时，将栈中所有数字弹出拼到结果（实现 D 段降序翻转）。
// 时间复杂度 O(n), 空间复杂度 O(n)
function smallestNumber2(pattern: string): string {
  const n: number = pattern.length;
  const stack: number[] = [];
  let result: string = "";
  for (let i: number = 0; i <= n; i++) {
    stack.push(i + 1);
    // 遇到 'I' 或末尾时弹出栈中所有数字
    if (i === n || pattern[i] === "I") {
      while (stack.length > 0) {
        result += String(stack.pop());
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 根据模式串构造最小数字 =====");
console.log(smallestNumber("IIIDIDDD")); // 期望结果: "123549876"
console.log(smallestNumber2("IIIDIDDD")); // 期望结果: "123549876"
console.log(smallestNumber("DDD")); // 期望结果: "4321"
console.log(smallestNumber2("DDD")); // 期望结果: "4321"

export {};
