// ============================================================
// 138. 句子相似性 II
// ============================================================
// LeetCode 737. Sentence Similarity II
// 给定两句子和相似词对列表，判断是否相似。相似性可传递。
// 时间复杂度：O((N+P) * α)，N 为句子长度，P 为对数；空间复杂度：O(P)

class UnionFind {
  parent: Map<string, string> = new Map();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      return x;
    }
    const p = this.parent.get(x)!;
    if (p === x) return x;
    const root = this.find(p);
    this.parent.set(x, root);
    return root;
  }

  union(x: string, y: string): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx !== ry) {
      this.parent.set(rx, ry);
    }
  }
}

function areSentencesSimilarTwo(
  sentence1: string[],
  sentence2: string[],
  similarPairs: string[][],
): boolean {
  if (sentence1.length !== sentence2.length) return false;

  // 并查集合并相似对
  const uf = new UnionFind();
  for (const [a, b] of similarPairs) {
    uf.union(a, b);
  }

  for (let i = 0; i < sentence1.length; i++) {
    const w1 = sentence1[i];
    const w2 = sentence2[i];
    if (w1 === w2) continue;
    if (uf.find(w1) !== uf.find(w2)) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 138. 句子相似性 II =====");
console.log(
  areSentencesSimilarTwo(
    ["great", "acting", "skills"],
    ["fine", "drama", "talent"],
    [
      ["great", "good"],
      ["fine", "good"],
      ["acting", "drama"],
      ["skills", "talent"],
    ],
  ),
); // 期望: true (great-good-fine 可传递)
console.log(areSentencesSimilarTwo(["great"], ["great"], [])); // 期望: true
console.log(areSentencesSimilarTwo(["great"], ["doubleplus", "good"], [["great", "good"]])); // 期望: false

export {};
