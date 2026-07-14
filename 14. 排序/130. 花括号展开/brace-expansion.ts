// ============================================================
// 130. 花括号展开
// ============================================================
// LeetCode 1087. Brace Expansion
// 给定形如 "{a,b}c{d,e}" 的字符串，按花括号展开（逗号分隔表示多选），
// 返回所有可能字符串，按字典序升序排列。

// 方法1：回溯 / DFS（最坏 O(n * 2^n)）
// 先把字符串解析为若干 "组"，每个组是单字母或多选字母数组，
// 再对每组做笛卡尔积回溯，组内排序保证按字典序生成。
function expand(s: string): string[] {
  const groups: string[][] = [];
  let i = 0;
  const n = s.length;
  while (i < n) {
    if (s[i] === "{") {
      i++; // 跳过 '{'
      const options: string[] = [];
      while (i < n && s[i] !== "}") {
        if (s[i] === ",") {
          i++;
        } else {
          options.push(s[i]);
          i++;
        }
      }
      i++; // 跳过 '}'
      options.sort(); // 组内排序，保证按字典序生成
      groups.push(options);
    } else {
      groups.push([s[i]]);
      i++;
    }
  }

  const result: string[] = [];
  const path: string[] = [];
  function dfs(idx: number): void {
    if (idx === groups.length) {
      result.push(path.join(""));
      return;
    }
    for (const ch of groups[idx]) {
      path.push(ch);
      dfs(idx + 1);
      path.pop();
    }
  }
  dfs(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 130. 花括号展开 =====");
console.log(expand("{a,b}c{d,e}")); // 期望: ["acd","ace","bcd","bce"]
console.log(expand("abcd")); // 期望: ["abcd"]
console.log(expand("{a,b}")); // 期望: ["a","b"]
console.log(expand("{b,a}c")); // 期望: ["ac","bc"]

export {};
