// ============================================================
// 067. 设计搜索自动补全系统
// ============================================================
// LeetCode 642. Design Search Autocomplete System
// 设计一个自动补全系统。给定历史句子及出现次数 times。
// 用户逐个输入字符（以 '#' 结尾表示句子输入结束）。
// 每输入一个字符（非 '#'），返回与当前输入前缀匹配的最热 3 个句子：
//   按出现次数降序；次数相同则按字典序升序。
// 输入 '#' 时，把当前输入的句子计入历史（次数 +1），并清空当前输入。

// 方法1：前缀树 Trie + DFS/Map 收集 + 排序（每次查询 O(候选数 log 候选数)）
// 每个 Trie 节点维护：children（字符->子节点），以及
// 经过该节点的所有句子 -> 出现次数 的映射。
// 查询时沿前缀走到对应节点，取出该节点的句子映射，排序后取前 3。
// 输入 '#' 时把句子插入 Trie，沿途每个节点更新该句子的次数。

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  // 经过该节点的所有句子及其出现次数
  sentences: Map<string, number> = new Map();
}

class AutocompleteSystem {
  private root: TrieNode;
  private curNode: TrieNode;
  private curInput: string;
  // 缓存全局句子次数，便于 '#' 时知道当前句子之前的次数（也可不缓存，Trie 根节点已有）
  private freq: Map<string, number>;

  constructor(sentences: string[], times: number[]) {
    this.root = new TrieNode();
    this.curNode = this.root;
    this.curInput = "";
    this.freq = new Map();
    for (let i = 0; i < sentences.length; i++) {
      this.freq.set(sentences[i], times[i]);
      this.insert(sentences[i], times[i]);
    }
  }

  private insert(sentence: string, times: number): void {
    let node = this.root;
    for (const ch of sentence) {
      let child = node.children.get(ch);
      if (!child) {
        child = new TrieNode();
        node.children.set(ch, child);
      }
      node = child;
      // 更新该节点的句子次数（增量 = times）
      node.sentences.set(sentence, (node.sentences.get(sentence) ?? 0) + times);
    }
  }

  input(c: string): string[] {
    if (c === "#") {
      // 把当前输入句子计入历史
      if (this.curInput.length > 0) {
        this.insert(this.curInput, 1);
      }
      // 重置
      this.curInput = "";
      this.curNode = this.root;
      return [];
    }

    this.curInput += c;

    // 沿前缀向下走
    const child = this.curNode.children.get(c);
    if (!child) {
      // 没有匹配，后续输入都不会有匹配，直到 '#'
      // 把 curNode 设为一个哑节点避免后续查找出错：用一个空节点占位
      this.curNode = new TrieNode();
      return [];
    }
    this.curNode = child;

    // 收集候选句子
    const candidates: Array<{ sentence: string; freq: number }> = [];
    for (const [sentence, f] of this.curNode.sentences) {
      candidates.push({ sentence, freq: f });
    }
    // 排序：次数降序，字典序升序
    candidates.sort((a, b) => {
      if (b.freq !== a.freq) return b.freq - a.freq;
      return a.sentence < b.sentence ? -1 : a.sentence > b.sentence ? 1 : 0;
    });

    return candidates.slice(0, 3).map((cand) => cand.sentence);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 设计搜索自动补全系统 =====");
const acs = new AutocompleteSystem(
  ["i love you", "island", "iroman", "i love leetcode"],
  [5, 3, 2, 2],
);
console.log(acs.input("i")); // 期望 ["i love you","island","i love leetcode"]
console.log(acs.input(" ")); // 期望 ["i love you","i love leetcode"]
console.log(acs.input("a")); // 期望 []
console.log(acs.input("#")); // 期望 []   （记录 "i a"）
console.log(acs.input("i")); // 期望 ["i love you","island","i love leetcode"] （"i a" 出现1次，仍排最后）
console.log(acs.input(" ")); // 期望 ["i love you","i love leetcode","i a"]
console.log(acs.input("a")); // 期望 ["i a"]
console.log(acs.input("#")); // 期望 []   （"i a" 次数变为 2）

export {};
