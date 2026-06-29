// ============================================================
// 017. 根据字符出现频率排序
// ============================================================
// LeetCode 451. Sort Characters By Frequency
// 给定一个字符串 s，根据字符出现的频率对它们降序排序。
// 时间复杂度：O(N log k)，空间复杂度：O(k)

// 方法1：最大堆（按频率）（推荐）
function frequencySort(s: string): string {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const heap: Array<{ ch: string; cnt: number }> = [];
  const siftDown = (i: number, n: number): void => {
    while (true) {
      let s2 = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && heap[l].cnt > heap[s2].cnt) s2 = l;
      if (r < n && heap[r].cnt > heap[s2].cnt) s2 = r;
      if (s2 !== i) {
        [heap[i], heap[s2]] = [heap[s2], heap[i]];
        i = s2;
      } else break;
    }
  };
  for (const [ch, cnt] of freq) heap.push({ ch, cnt });
  const n = heap.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i, n);
  const result: string[] = [];
  while (heap.length > 0) {
    const top = heap[0];
    result.push(top.ch.repeat(top.cnt));
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0, heap.length);
  }
  return result.join("");
}

// 方法2：桶排序
function frequencySortBucket(s: string): string {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  const buckets: string[][] = Array.from({ length: maxFreq + 1 }, () => []);
  for (const [ch, cnt] of freq) buckets[cnt].push(ch);
  const result: string[] = [];
  for (let i = maxFreq; i >= 1; i--) {
    for (const ch of buckets[i]) result.push(ch.repeat(i));
  }
  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 根据字符出现频率排序 =====");
console.log("最大堆:", frequencySort("tree")); // 期望 "eert" 或 "eetr"
console.log("桶排序:", frequencySortBucket("cccaaa")); // 期望 "aaaccc" 或 "cccaaa"

export {};
