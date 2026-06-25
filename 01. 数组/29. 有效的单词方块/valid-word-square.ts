// ============================================================
// 29. 有效的单词方块
// ============================================================
// LeetCode 422. Valid Word Square
// 给定字符串序列 words，判断是否构成有效的单词方块。
// 单词方块是指第 k 行和第 k 列读出的字符串相同。
// 时间复杂度：O(n*m)，空间复杂度：O(1)

// 方法1：双重循环检查（推荐）
function validWordSquare(words: string[]): boolean {
  const n = words.length;
  for (let i = 0; i < n; i++) {
    const row = words[i];
    for (let j = 0; j < row.length; j++) {
      // 检查第 j 个字符串是否存在，并且其第 i 个字符与第 i 行第 j 列字符相同
      if (j >= n) {
        // 列超出行数，说明该列下方无字符，但该行此处有字符
        return false;
      }
      const col = words[j];
      if (i >= col.length) {
        // 列对应位置不存在字符，但行有字符
        return false;
      }
      if (row[j] !== col[i]) {
        return false;
      }
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 29. 有效的单词方块 =====");
console.log("描述:", validWordSquare(["abcd", "bnrt", "crmy", "dtye"])); // 期望结果: true
console.log("描述:", validWordSquare(["abcd", "bnrt", "crm", "dt"])); // 期望结果: true
console.log("描述:", validWordSquare(["ball", "area", "read", "lady"])); // 期望结果: false
console.log("描述:", validWordSquare(["abc", "b"])); // 期望结果: false

export {};
