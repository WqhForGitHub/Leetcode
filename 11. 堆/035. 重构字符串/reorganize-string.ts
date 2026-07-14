// ============================================================
// 035. 重构字符串
// ============================================================
// LeetCode 767. Reorganize String
// 重排字符串使相邻字符不相同，返回任意一个可行解。
// 时间复杂度：O(N)，空间复杂度：O(1)

// 方法1：最大堆（按字符频率）
function reorganizeString(s: string): string {
  const freq = new Array(26).fill(0);
  for (const ch of s) freq[ch.charCodeAt(0) - 97]++;
  if (Math.max(...freq) > (s.length + 1) >> 1) return "";
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
  for (let i = 0; i < 26; i++) {
    if (freq[i] > 0) heap.push({ ch: String.fromCharCode(97 + i), cnt: freq[i] });
  }
  const n = heap.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i, n);
  const result: string[] = [];
  while (heap.length > 1) {
    const a = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0, heap.length);
    const b = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0, heap.length);
    result.push(a.ch, b.ch);
    if (a.cnt > 1) {
      heap.push({ ch: a.ch, cnt: a.cnt - 1 });
      siftUp(heap.length - 1);
    }
    if (b.cnt > 1) {
      heap.push({ ch: b.ch, cnt: b.cnt - 1 });
      siftUp(heap.length - 1);
    }
  }
  function siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].cnt > heap[p].cnt) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  }
  if (heap.length === 1) result.push(heap[0].ch);
  return result.join("");
}

// 方法2：奇偶位置填充
function reorganizeStringOddEven(s: string): string {
  const freq = new Array(26).fill(0);
  for (const ch of s) freq[ch.charCodeAt(0) - 97]++;
  const maxFreq = Math.max(...freq);
  const maxChar = freq.indexOf(maxFreq);
  if (maxFreq > (s.length + 1) >> 1) return "";
  const res: string[] = new Array(s.length).fill("");
  let idx = 0;
  for (let i = 0; i < freq[maxChar]; i++) {
    res[idx] = String.fromCharCode(97 + maxChar);
    idx += 2;
  }
  freq[maxChar] = 0;
  for (let i = 0; i < 26; i++) {
    while (freq[i] > 0) {
      if (idx >= s.length) idx = 1;
      res[idx] = String.fromCharCode(97 + i);
      idx += 2;
      freq[i]--;
    }
  }
  return res.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 重构字符串 =====");
console.log("堆:", reorganizeString("aab")); // 期望 "aba"
console.log("奇偶:", reorganizeStringOddEven("aaab")); // 期望 ""

export {};
