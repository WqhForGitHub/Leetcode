// ============================================================
// 091. 键盘行
// ============================================================
// LeetCode 500. Keyboard Row
// 给定一个单词列表，返回可以使用键盘上同一行字母打印的单词。
// 时间复杂度：O(n*m)，空间复杂度：O(1)

// 键盘三行字母
const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// 构建字母到行号的哈希映射
const charToRow = new Map<string, number>();
ROWS.forEach((row, idx) => {
  for (const ch of row) {
    charToRow.set(ch, idx);
  }
});

function findWords(words: string[]): string[] {
  const result: string[] = [];
  for (const word of words) {
    const lower = word.toLowerCase();
    if (lower.length === 0) continue;
    const rowIdx = charToRow.get(lower[0])!;
    let sameRow = true;
    for (let i = 1; i < lower.length; i++) {
      if (charToRow.get(lower[i]) !== rowIdx) {
        sameRow = false;
        break;
      }
    }
    if (sameRow) result.push(word);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 键盘行 =====");
// 测试 1: ["Hello","Alaska","Dad","Peace"] -> ["Alaska","Dad"]
console.log(findWords(["Hello", "Alaska", "Dad", "Peace"]));
// 测试 2: ["omk"] -> []
console.log(findWords(["omk"]));
// 测试 3: ["adsdf","sfd"] -> ["adsdf","sfd"]
console.log(findWords(["adsdf", "sfd"]));

export {};
