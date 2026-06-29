// ============================================================
// 112. 构造限制重复的字符串
// ============================================================
// LeetCode 2182. Construct String With Repeat Limit
// 用给定字符构造字典序最大的字符串，使相同字符不连续超过 repeatLimit 次。
// 时间复杂度：O(N log 26)，空间复杂度：O(1)

// 方法1：最大堆（按字符）
function repeatLimitedString(s: string, repeatLimit: number): string {
  const freq = new Array(26).fill(0);
  for (const ch of s) freq[ch.charCodeAt(0) - 97]++;
  const heap: Array<{ ch: string; cnt: number }> = [];
  const pushMax = (v: { ch: string; cnt: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].ch > heap[p].ch) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): { ch: string; cnt: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].ch > heap[s].ch) s = l;
        if (r < heap.length && heap[r].ch > heap[s].ch) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < 26; i++) {
    if (freq[i] > 0) pushMax({ ch: String.fromCharCode(97 + i), cnt: freq[i] });
  }
  const result: string[] = [];
  while (heap.length > 0) {
    const top = popMax();
    const use = Math.min(top.cnt, repeatLimit);
    result.push(top.ch.repeat(use));
    top.cnt -= use;
    if (top.cnt > 0) {
      if (heap.length === 0) break;
      const next = popMax();
      result.push(next.ch);
      next.cnt--;
      if (next.cnt > 0) pushMax(next);
      pushMax(top);
    }
  }
  return result.join("");
}

// 方法2：贪心（无堆）
function repeatLimitedStringGreedy(s: string, repeatLimit: number): string {
  const freq = new Array(26).fill(0);
  for (const ch of s) freq[ch.charCodeAt(0) - 97]++;
  const result: string[] = [];
  let i = 25;
  while (i >= 0) {
    if (freq[i] === 0) { i--; continue; }
    const use = Math.min(freq[i], repeatLimit);
    result.push(String.fromCharCode(97 + i).repeat(use));
    freq[i] -= use;
    if (freq[i] > 0) {
      let j = i - 1;
      while (j >= 0 && freq[j] === 0) j--;
      if (j < 0) break;
      result.push(String.fromCharCode(97 + j));
      freq[j]--;
    }
  }
  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 112. 构造限制重复的字符串 =====");
console.log("堆:", repeatLimitedString("cczazcc", 3)); // 期望 "zzcccac"
console.log("贪心:", repeatLimitedStringGreedy("aababab", 2)); // 期望 "bbabaa"

export {};
