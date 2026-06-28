// ============================================================
// 136. 句子相似性
// ============================================================
// LeetCode 734. Sentence Similarity
// 给定两句子和相似词对列表，判断两句子是否相似。
// 相似性可传递？本题不传递（这是 I），相似对为双向。
// 时间复杂度：O(N + P)，N 为句子长度，P 为对数；空间复杂度：O(P)

function areSentencesSimilar(
  sentence1: string[],
  sentence2: string[],
  similarPairs: string[][],
): boolean {
  // 长度不同直接 false
  if (sentence1.length !== sentence2.length) return false;

  // 哈希集合存相似对（双向）
  const sim = new Set<string>();
  for (const [a, b] of similarPairs) {
    sim.add(a + "#" + b);
    sim.add(b + "#" + a);
  }

  for (let i = 0; i < sentence1.length; i++) {
    const w1 = sentence1[i];
    const w2 = sentence2[i];
    if (w1 === w2) continue; // 相同
    if (sim.has(w1 + "#" + w2)) continue; // 相似
    return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 136. 句子相似性 =====");
console.log(
  areSentencesSimilar(
    ["great", "acting", "skills"],
    ["fine", "drama", "talent"],
    [["great", "fine"], ["acting", "drama"], ["skills", "talent"]],
  ),
); // 期望: true
console.log(
  areSentencesSimilar(["great"], ["great"], []),
); // 期望: true
console.log(
  areSentencesSimilar(["great"], ["doubleplus", "good"], [["great", "good"]]),
); // 期望: false

export {};
