// ============================================================
// 36. 键盘行
// ============================================================
// LeetCode 500. Keyboard Row
// 给定单词数组 words，返回可以用美式键盘上一行字母打出的单词。
// 第一行：qwertyuiop，第二行：asdfghjkl，第三行：zxcvbnm
// 时间复杂度：O(n*m)，空间复杂度：O(1)

// 方法1：Set 判断每个字母所属行（推荐）
function findWords(words: string[]): string[] {
  // 三行字母对应的 Set
  const row1 = new Set("qwertyuiop".split(""));
  const row2 = new Set("asdfghjkl".split(""));
  const row3 = new Set("zxcvbnm".split(""));
  const rows = [row1, row2, row3];

  const result: string[] = [];

  for (const word of words) {
    const lower = word.toLowerCase();
    // 找到首字母所在行
    const firstChar = lower[0];
    let targetRow: Set<string> | null = null;
    for (const row of rows) {
      if (row.has(firstChar)) {
        targetRow = row;
        break;
      }
    }

    // 检查所有字母是否都在同一行
    let allInOneRow = true;
    for (const ch of lower) {
      if (targetRow && !targetRow.has(ch)) {
        allInOneRow = false;
        break;
      }
    }

    if (allInOneRow) {
      result.push(word);
    }
  }

  return result;
}

// 方法2：预计算每个字母的行号
function findWordsByRowNumber(words: string[]): string[] {
  // 预计算每个字母所属行号（0/1/2）
  const rowOfChar: Record<string, number> = {};
  "qwertyuiop".split("").forEach((c) => (rowOfChar[c] = 0));
  "asdfghjkl".split("").forEach((c) => (rowOfChar[c] = 1));
  "zxcvbnm".split("").forEach((c) => (rowOfChar[c] = 2));

  return words.filter((word) => {
    const lower = word.toLowerCase();
    const row = rowOfChar[lower[0]];
    return lower.split("").every((c) => rowOfChar[c] === row);
  });
}

// ============================================================
// 测试
// ============================================================
console.log("===== 36. 键盘行 =====");
console.log("描述:", findWords(["Hello", "Alaska", "Dad", "Peace"])); // 期望结果: ["Alaska","Dad"]
console.log("描述:", findWords(["omk"])); // 期望结果: ["omk"]
console.log("描述:", findWords(["adsdf", "sfd"])); // 期望结果: ["adsdf","sfd"]
console.log("描述:", findWordsByRowNumber(["Hello", "Alaska", "Dad", "Peace"])); // 期望结果: ["Alaska","Dad"]

export {};
