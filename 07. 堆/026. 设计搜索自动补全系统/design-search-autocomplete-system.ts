// ============================================================
// 026. 设计搜索自动补全系统
// ============================================================
// LeetCode 642. Design Search Autocomplete System
// 设计自动补全系统，根据历史输入频率返回前 3 个匹配的热门句子。
// 时间复杂度：每次输入 O(N log N)，N 为句子数

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  freq: Map<string, number> = new Map();
}

// 方法1：Trie + 堆
class AutocompleteSystem {
  private root: TrieNode = new TrieNode();
  private curr: TrieNode = this.root;
  private prefix: string = "";
  constructor(sentences: string[], times: number[]) {
    for (let i = 0; i < sentences.length; i++) {
      this.insert(sentences[i], times[i]);
    }
  }
  private insert(s: string, t: number): void {
    let node = this.root;
    for (const ch of s) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      node.freq.set(s, (node.freq.get(s) ?? 0) + t);
    }
  }
  input(c: string): string[] {
    if (c === "#") {
      this.insert(this.prefix, 1);
      this.prefix = "";
      this.curr = this.root;
      return [];
    }
    this.prefix += c;
    if (!this.curr.children.has(c)) {
      this.curr = new TrieNode();
      return [];
    }
    this.curr = this.curr.children.get(c)!;
    const entries = Array.from(this.curr.freq.entries());
    // 最小堆维护前 3
    const heap: Array<{ s: string; f: number }> = [];
    const push = (v: { s: string; f: number }): void => {
      heap.push(v);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        const cmp = this.compare(heap[i], heap[p]);
        if (cmp < 0) {
          [heap[i], heap[p]] = [heap[p], heap[i]];
          i = p;
        } else break;
      }
    };
    const pop = (): { s: string; f: number } => {
      const top = heap[0];
      const last = heap.pop()!;
      if (heap.length > 0) {
        heap[0] = last;
        let i = 0;
        while (true) {
          let s2 = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < heap.length && this.compare(heap[l], heap[s2]) < 0) s2 = l;
          if (r < heap.length && this.compare(heap[r], heap[s2]) < 0) s2 = r;
          if (s2 !== i) {
            [heap[i], heap[s2]] = [heap[s2], heap[i]];
            i = s2;
          } else break;
        }
      }
      return top;
    };
    for (const [s, f] of entries) {
      push({ s, f });
      if (heap.length > 3) pop();
    }
    const res: string[] = [];
    while (heap.length > 0) res.unshift(pop().s);
    return res;
  }
  private compare(a: { s: string; f: number }, b: { s: string; f: number }): number {
    if (a.f !== b.f) return a.f - b.f;
    return b.s < a.s ? -1 : 1;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 设计搜索自动补全系统 =====");
const acs = new AutocompleteSystem(["i love you", "island", "iroman", "i love leetcode"], [5, 3, 2, 2]);
console.log("输入 i:", acs.input("i")); // 期望 ["i love you","island","i love leetcode"]
console.log("输入 ' ':", acs.input(" "));
console.log("输入 a:", acs.input("a"));
console.log("输入 #:", acs.input("#"));

export {};
