// ============================================================
// 055. 单词缩写
// ============================================================
// LeetCode 408. Valid Word Abbreviation
// 判断缩写 abbr 是否能表示单词 word。
// 缩写中的数字表示跳过对应数量的字符，字母需逐个匹配。
// 例如 "word" 可缩写为 "w2d"、"1ord"、"4"，但不能有前导零。

// 方法1：双指针（推荐，O(n) 时间）
// i 指向 word，j 指向 abbr。
// 遇到字母则直接比较；遇到数字则解析完整数字（禁止前导零），i 跳过该数量。
// 最后两者需同时遍历完毕。
function validWordAbbreviation(word: string, abbr: string): boolean {
  let i = 0;
  let j = 0;
  while (i < word.length && j < abbr.length) {
    const ch = abbr[j];
    if (isDigit(ch)) {
      // 前导零非法
      if (ch === "0") return false;
      let num = 0;
      while (j < abbr.length && isDigit(abbr[j])) {
        num = num * 10 + (abbr.charCodeAt(j) - "0".charCodeAt(0));
        j++;
      }
      i += num;
      // 跳过数量不能超出剩余字符
      if (i > word.length) return false;
    } else {
      if (word[i] !== ch) return false;
      i++;
      j++;
    }
  }
  return i === word.length && j === abbr.length;
}

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

// 方法2：正则展开思路的逐位解析（O(n) 时间）
// 思路相同，结构上把数字解析与字母匹配合并到一个循环中，便于理解。
function validWordAbbreviationAlt(word: string, abbr: string): boolean {
  let i = 0;
  let j = 0;
  const n = word.length;
  const m = abbr.length;
  while (j < m) {
    if (isDigit(abbr[j])) {
      if (abbr[j] === "0") return false;
      let num = 0;
      while (j < m && isDigit(abbr[j])) {
        num = num * 10 + (abbr.charCodeAt(j) - "0".charCodeAt(0));
        j++;
      }
      i += num;
      if (i > n) return false;
    } else {
      if (i >= n || word[i] !== abbr[j]) return false;
      i++;
      j++;
    }
  }
  return i === n;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 单词缩写 =====");
console.log("双指针 word=internationalization, abbr=i12iz4n:",
  validWordAbbreviation("internationalization", "i12iz4n")); // 期望 true
console.log("双指针 word=apple, abbr=a2e:",
  validWordAbbreviation("apple", "a2e")); // 期望 false
console.log("双指针 word=word, abbr=w2d:",
  validWordAbbreviation("word", "w2d")); // 期望 true
console.log("双指针 word=word, abbr=4:",
  validWordAbbreviation("word", "4")); // 期望 true
console.log("双指针 word=word, abbr=w0rd:",
  validWordAbbreviation("word", "w0rd")); // 期望 false (前导零)
console.log("备选 word=internationalization, abbr=i12iz4n:",
  validWordAbbreviationAlt("internationalization", "i12iz4n")); // 期望 true
console.log("备选 word=apple, abbr=a2e:",
  validWordAbbreviationAlt("apple", "a2e")); // 期望 false

export {};
