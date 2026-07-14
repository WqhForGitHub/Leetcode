// ============================================================
// 144. 字符串中的加粗单词
// ============================================================
// LeetCode 758. Bold Words in String
// 给定单词数组 words 和字符串 s，将 s 中所有出现在 words 中的子串用 <b></b> 包裹。
// 相邻或重叠的合并为一对 <b>。与 616 题类似。
// 时间复杂度：O(n * m * L)；空间复杂度：O(n)

function boldWords(words: string[], s: string): string {
  const n = s.length;
  const bold = new Array(n).fill(false);

  // 标记所有匹配位置
  for (const w of words) {
    let start = s.indexOf(w);
    while (start !== -1) {
      for (let i = start; i < start + w.length; i++) {
        bold[i] = true;
      }
      start = s.indexOf(w, start + 1);
    }
  }

  // 构造结果
  let result = "";
  for (let i = 0; i < n; i++) {
    if (bold[i] && (i === 0 || !bold[i - 1])) result += "<b>";
    result += s[i];
    if (bold[i] && (i === n - 1 || !bold[i + 1])) result += "</b>";
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 144. 字符串中的加粗单词 =====");
console.log(boldWords(["ab", "bc"], "aabcd")); // 期望: "a<b>abc</b>d"
console.log(boldWords(["ccb", "b", "d", "cba", "dc"], "eeabccba")); // 期望: "ee<b>abccba</b>"

export {};
