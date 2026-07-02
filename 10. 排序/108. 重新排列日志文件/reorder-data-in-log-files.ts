// ============================================================
// 108. 重新排列日志文件
// ============================================================
// LeetCode 937. Reorder Data in Log Files
// 字母日志排在数字日志之前；字母日志先按内容字典序排序，内容相同则按标识符排序；
// 数字日志保持原有相对顺序。

// 方法1：自定义排序比较器（O(n log n * L) 时间，O(L) 空间）
// 比较器先判断日志类型（字母/数字），再按规则比较。
function reorderLogFiles(logs: string[]): string[] {
  const result = logs.slice();
  result.sort((a, b) => compareLogs(a, b));
  return result;
}

function compareLogs(a: string, b: string): number {
  const aSpace = a.indexOf(" ");
  const bSpace = b.indexOf(" ");
  const aId = a.substring(0, aSpace);
  const aContent = a.substring(aSpace + 1);
  const bId = b.substring(0, bSpace);
  const bContent = b.substring(bSpace + 1);
  const aIsDigit = isDigitLog(aContent);
  const bIsDigit = isDigitLog(bContent);
  if (aIsDigit && bIsDigit) {
    // 都是数字日志：保持原相对顺序（Array.sort 是稳定排序）
    return 0;
  }
  if (aIsDigit) {
    // a 是数字日志，应排在 b（字母日志）后面
    return 1;
  }
  if (bIsDigit) {
    return -1;
  }
  // 都是字母日志：先按内容排序，内容相同按标识符排序
  if (aContent === bContent) {
    return aId < bId ? -1 : aId > bId ? 1 : 0;
  }
  return aContent < bContent ? -1 : 1;
}

function isDigitLog(content: string): boolean {
  const ch = content.charAt(0);
  return ch >= "0" && ch <= "9";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 108. 重新排列日志文件 =====");
console.log(
  JSON.stringify(
    reorderLogFiles([
      "dig1 8 1 5 1",
      "let1 art can",
      "dig2 3 6",
      "let2 own kit dig",
      "let3 art zero",
    ]),
  ),
);
// 期望 ["let1 art can","let3 art zero","let2 own kit dig","dig1 8 1 5 1","dig2 3 6"]
console.log(
  JSON.stringify(
    reorderLogFiles(["a1 9 2 3 1", "g1 act car", "zo4 4 7", "ab1 off key dog", "a8 act zoo"]),
  ),
);
// 期望 ["g1 act car","a8 act zoo","ab1 off key dog","a1 9 2 3 1","zo4 4 7"]

export {};
