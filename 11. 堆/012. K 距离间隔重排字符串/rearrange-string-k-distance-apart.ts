// ============================================================
// 012. K 距离间隔重排字符串
// ============================================================
// LeetCode 358. Rearrange String k Distance Apart
// 给定一个非空字符串 s 和一个整数 k，重排字符串使相同字符间隔至少为 k。
// 时间复杂度：O(N log 26)，空间复杂度：O(1)

// 方法1：最大堆（按剩余次数）（推荐）
function rearrangeString(s: string, k: number): string {
  if (k <= 1) return s;
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const heap: Array<{ ch: string; cnt: number }> = [];
  for (const [ch, cnt] of freq) heap.push({ ch, cnt });
  const buildHeap = (): void => {
    const n = heap.length;
    for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i);
  };
  const siftDown = (i: number): void => {
    const n = heap.length;
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
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].cnt > heap[p].cnt) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  buildHeap();
  const result: string[] = [];
  const queue: Array<{ ch: string; cnt: number }> = [];
  while (heap.length > 0) {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0);
    }
    result.push(top.ch);
    top.cnt--;
    queue.push(top);
    if (queue.length >= k) {
      const item = queue.shift()!;
      if (item.cnt > 0) {
        heap.push(item);
        siftUp(heap.length - 1);
      }
    }
  }
  return result.length === s.length ? result.join("") : "";
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. K 距离间隔重排字符串 =====");
console.log("重排:", rearrangeString("aabbcc", 3)); // 期望 "abcabc"
console.log("重排:", rearrangeString("aaabc", 3)); // 期望 ""

export {};
