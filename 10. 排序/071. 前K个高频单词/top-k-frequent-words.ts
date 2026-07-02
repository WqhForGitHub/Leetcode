// ============================================================
// 071. 前K个高频单词
// ============================================================
// LeetCode 692. Top K Frequent Words
// 给定单词列表，返回出现次数最多的 k 个单词，
// 按频率降序排列；频率相同的按字典序升序排列。

interface WordFreq {
  word: string;
  freq: number;
}

// 方法1：计数 + 自定义比较器排序（O(n log n) 时间，O(n) 空间）
// 先统计每个单词频率，再按 (频率降序, 单词升序) 排序，取前 k 个。
function topKFrequent(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  const entries: WordFreq[] = [];
  for (const [word, f] of freq) {
    entries.push({ word, freq: f });
  }

  entries.sort((a, b) => {
    if (b.freq !== a.freq) return b.freq - a.freq;
    return a.word < b.word ? -1 : a.word > b.word ? 1 : 0;
  });

  return entries.slice(0, k).map((e) => e.word);
}

// 方法2：大小为 k 的最小堆（O(n log k) 时间，O(n) 空间）
// 堆中保留当前最优的 k 个。比较时定义 "更差" 的元素靠近堆顶：
//   - 频率更低更差；频率相同则字典序更大的更差。
// 当堆大小超过 k 时弹出堆顶（最差者）。最后堆中即是最优 k 个，
// 依次弹出得到由差到好的顺序，反转即为最终答案。
class WordFreqMinHeap {
  private data: WordFreq[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): WordFreq {
    return this.data[0];
  }

  push(entry: WordFreq): void {
    this.data.push(entry);
    this.siftUp(this.data.length - 1);
  }

  pop(): WordFreq {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  // "更差" 的元素更靠近堆顶：频率低更差；频率相同字典序大更差。
  private isWorse(a: WordFreq, b: WordFreq): boolean {
    if (a.freq !== b.freq) return a.freq < b.freq;
    return a.word > b.word;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.isWorse(this.data[i], this.data[parent])) {
        const tmp = this.data[parent];
        this.data[parent] = this.data[i];
        this.data[i] = tmp;
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.isWorse(this.data[left], this.data[smallest])) smallest = left;
      if (right < n && this.isWorse(this.data[right], this.data[smallest])) smallest = right;
      if (smallest === i) break;
      const tmp = this.data[smallest];
      this.data[smallest] = this.data[i];
      this.data[i] = tmp;
      i = smallest;
    }
  }
}

function topKFrequent_heap(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  const heap = new WordFreqMinHeap();
  for (const [word, f] of freq) {
    heap.push({ word, freq: f });
    if (heap.size() > k) {
      heap.pop(); // 弹出最差者
    }
  }

  // 堆中剩余 k 个最优元素，弹出顺序为由差到好，反转得到由好到差
  const result: string[] = [];
  while (heap.size() > 0) {
    result.push(heap.pop().word);
  }
  result.reverse();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 前K个高频单词 =====");
console.log("排序法:", topKFrequent(["i", "love", "leetcode", "i", "love", "coding"], 2)); // 期望 ["i","love"]
console.log(
  "排序法:",
  topKFrequent(["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4),
); // 期望 ["the","is","sunny","day"]
console.log("最小堆:", topKFrequent_heap(["i", "love", "leetcode", "i", "love", "coding"], 2)); // 期望 ["i","love"]
console.log(
  "最小堆:",
  topKFrequent_heap(["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4),
); // 期望 ["the","is","sunny","day"]

export {};
