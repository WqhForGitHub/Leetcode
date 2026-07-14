// ============================================================
// 111. 给字符串添加加粗标签
// ============================================================
// LeetCode 616. Add Bold Tag in String
// 给定字符串 s 和字符串数组 words，将 s 中所有出现在 words 中的子串用 <b></b> 包裹。
// 重叠或相邻的子串需合并为一对 <b> 标签。
// 时间复杂度：O(n * m * L)，n=s.length，m=words.length，L=平均词长；空间复杂度：O(n)

// 思路：布尔数组标记需要加粗的位置，再扫描合并
function addBoldTag(s: string, words: string[]): string {
  const n = s.length;
  const bold = new Array(n).fill(false);

  // 标记所有出现在 words 中的子串位置
  for (const w of words) {
    let start = s.indexOf(w);
    while (start !== -1) {
      for (let i = start; i < start + w.length; i++) {
        bold[i] = true;
      }
      start = s.indexOf(w, start + 1);
    }
  }

  // 根据标记构造结果，合并相邻区间
  let result = "";
  for (let i = 0; i < n; i++) {
    if (bold[i] && (i === 0 || !bold[i - 1])) {
      result += "<b>";
    }
    result += s[i];
    if (bold[i] && (i === n - 1 || !bold[i + 1])) {
      result += "</b>";
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 111. 给字符串添加加粗标签 =====");
// 测试 1
console.log(addBoldTag("abcxyz123", ["abc", "123"])); // 期望: "<b>abc</b>xyz<b>123</b>"
// 测试 2: 重叠/相邻
console.log(addBoldTag("aaabbcc", ["aaa", "aab", "bc"])); // 期望: "<b>aaabbc</b>c"
// 测试 3: 无匹配
console.log(addBoldTag("abcdef", ["xyz"])); // 期望: "abcdef"

export {};
