// ============================================================
// 031. 前K个高频单词
// ============================================================
// LeetCode 692. Top K Frequent Words
// 返回前 k 个高频单词，频率相同按字典序。
// 时间复杂度：O(N log k)，空间复杂度：O(N)

// 方法1：最小堆（推荐）
function topKFrequent(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const heap: Array<{ w: string; f: number }> = [];
  const less = (a: number, b: number): boolean => {
    return heap[a].f < heap[b].f || (heap[a].f === heap[b].f && heap[a].w > heap[b].w);
  };
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (less(i, p)) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number): void => {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && less(l, s)) s = l;
      if (r < n && less(r, s)) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (const [w, f] of freq) {
    heap.push({ w, f });
    siftUp(heap.length - 1);
    if (heap.length > k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
  }
  const res: string[] = [];
  while (heap.length > 0) {
    res.unshift(heap[0].w);
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0);
    }
  }
  return res;
}

// 方法2：排序
function topKFrequentSort(words: string[], k: number): string[] {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const arr = Array.from(freq.entries());
  arr.sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  return arr.slice(0, k).map((x) => x[0]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 前K个高频单词 =====");
console.log("堆:", topKFrequent(["i", "love", "leetcode", "i", "love", "coding"], 2)); // 期望 ["i","love"]
console.log("排序:", topKFrequentSort(["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4));
// 期望 ["the","is","sunny","day"]

export {};
