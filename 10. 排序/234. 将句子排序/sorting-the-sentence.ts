// ============================================================
// 234. 将句子排序
// ============================================================
// LeetCode 1859. Sorting the Sentence
// 给定一个被打乱的句子 s，每个单词末尾附有 1-9 的数字表示原始位置，
// 要求重建原始句子（去掉数字后按数字顺序排列单词）。

// 方法1：分割 + 按末尾数字排序（O(n log n)）
function sortSentence1(s: string): string {
  const words = s.split(" ");
  words.sort((a, b) => {
    const na = Number(a[a.length - 1]);
    const nb = Number(b[b.length - 1]);
    return na - nb;
  });
  return words.map((w) => w.slice(0, w.length - 1)).join(" ");
}

// 方法2：分割 + 按索引直接放置（O(n)）
function sortSentence2(s: string): string {
  const words = s.split(" ");
  const arr: string[] = new Array(words.length);
  for (const w of words) {
    const num = Number(w[w.length - 1]);
    arr[num - 1] = w.slice(0, w.length - 1);
  }
  return arr.join(" ");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 234. 将句子排序 =====");
console.log("方法1 is2 sentence4 This1 a3:", sortSentence1("is2 sentence4 This1 a3")); // "This is a sentence"
console.log("方法2 is2 sentence4 This1 a3:", sortSentence2("is2 sentence4 This1 a3")); // "This is a sentence"
console.log("方法1 Myself2 Me1 I3 and4:", sortSentence1("Myself2 Me1 I3 and4")); // "Me Myself I and"
console.log("方法2 Myself2 Me1 I3 and4:", sortSentence2("Myself2 Me1 I3 and4")); // "Me Myself I and"

export {};
