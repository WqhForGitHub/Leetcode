// ============================================================
// 153. 唯一摩尔斯密码词
// ============================================================
// LeetCode 804. Unique Morse Code Words
// 给定单词列表，每个字母可映射为对应摩尔斯码，求不同单词的不同摩尔斯码数量。
// 时间复杂度：O(N*L)，N 为单词数，L 为平均长度；空间复杂度：O(N*L)

function uniqueMorseRepresentations(words: string[]): number {
  const morse = [
    ".-",
    "-...",
    "-.-.",
    "-..",
    ".",
    "..-.",
    "--.",
    "....",
    "..",
    ".---",
    "-.-",
    ".-..",
    "--",
    "-.",
    "---",
    ".--.",
    "--.-",
    ".-.",
    "...",
    "-",
    "..-",
    "...-",
    ".--",
    "-..-",
    "-.--",
    "--..",
  ];

  const transformations = new Set<string>();
  for (const word of words) {
    let code = "";
    for (const ch of word) {
      code += morse[ch.charCodeAt(0) - 97];
    }
    transformations.add(code);
  }
  return transformations.size;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 153. 唯一摩尔斯密码词 =====");
console.log(uniqueMorseRepresentations(["gin", "zen", "gig", "msg"])); // 期望: 2
console.log(uniqueMorseRepresentations(["a"])); // 期望: 1

export {};
