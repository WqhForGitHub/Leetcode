// ============================================================
// 107. 生成不含相邻零的二进制字符串
// ============================================================
// LeetCode 3211. Generate Binary Strings Without Adjacent Zeros
// 生成所有长度为 n 且不含 "00"（两个相邻零）的二进制字符串，按升序返回
// 时间复杂度：O(2^n), 空间复杂度：O(n)

// 方法1：回溯（推荐）
// 逐位构建字符串，只在前一位为 1 或为空时才可填 0
function validStrings(n: number): string[] {
  const result: string[] = [];

  function backtrack(curr: string[]): void {
    if (curr.length === n) {
      result.push(curr.join(""));
      return;
    }
    // 填 1（总是可以）
    curr.push("1");
    backtrack(curr);
    curr.pop();
    // 填 0（仅当前一位为 1 或为空时可以）
    if (curr.length === 0 || curr[curr.length - 1] === "1") {
      curr.push("0");
      backtrack(curr);
      curr.pop();
    }
  }

  backtrack([]);
  result.sort();
  return result;
}

// 方法2：迭代
// 从长度 1 开始逐步扩展，每位只能填 1 或在前一位为 1 时填 0
function validStrings2(n: number): string[] {
  let result: string[] = ["0", "1"];
  for (let i: number = 2; i <= n; i++) {
    const next: string[] = [];
    for (const s of result) {
      next.push(s + "1");
      if (s[s.length - 1] === "1") {
        next.push(s + "0");
      }
    }
    result = next;
  }
  result.sort();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 107. 生成不含相邻零的二进制字符串 =====");
console.log(validStrings(3)); // 期望结果: ["010","011","101","110","111"]
console.log(validStrings(1)); // 期望结果: ["0","1"]
console.log("--- 方法2测试 ---");
console.log(validStrings2(3)); // 期望结果: ["010","011","101","110","111"]
console.log(validStrings2(1)); // 期望结果: ["0","1"]

export {};
