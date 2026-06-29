// ============================================================
// 067. 最长快乐字符串
// ============================================================
// LeetCode 1405. Longest Happy String
// 用 'a'、'b'、'c' 构造最长字符串，使没有 "aaa"、"bbb"、"ccc"。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：贪心 + 最大堆（推荐）
function longestDiverseString(a: number, b: number, c: number): string {
  const heap: Array<{ ch: string; cnt: number }> = [];
  const pushMax = (v: { ch: string; cnt: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].cnt > heap[p].cnt) {
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
        if (l < heap.length && heap[l].cnt > heap[s].cnt) s = l;
        if (r < heap.length && heap[r].cnt > heap[s].cnt) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  if (a > 0) pushMax({ ch: "a", cnt: a });
  if (b > 0) pushMax({ ch: "b", cnt: b });
  if (c > 0) pushMax({ ch: "c", cnt: c });
  const result: string[] = [];
  while (heap.length > 0) {
    const top = popMax();
    const len = result.length;
    if (len >= 2 && result[len - 1] === top.ch && result[len - 2] === top.ch) {
      if (heap.length === 0) break;
      const next = popMax();
      result.push(next.ch);
      next.cnt--;
      if (next.cnt > 0) pushMax(next);
      pushMax(top);
    } else {
      result.push(top.ch);
      top.cnt--;
      if (top.cnt > 0) pushMax(top);
    }
  }
  return result.join("");
}

// 方法2：贪心（无堆）
function longestDiverseStringGreedy(a: number, b: number, c: number): string {
  const arr: Array<{ ch: string; cnt: number }> = [
    { ch: "a", cnt: a },
    { ch: "b", cnt: b },
    { ch: "c", cnt: c },
  ];
  const result: string[] = [];
  while (true) {
    arr.sort((x, y) => y.cnt - x.cnt);
    let added = false;
    for (const item of arr) {
      const len = result.length;
      if (item.cnt > 0 && (len < 2 || result[len - 1] !== item.ch || result[len - 2] !== item.ch)) {
        result.push(item.ch);
        item.cnt--;
        added = true;
        break;
      }
    }
    if (!added) break;
  }
  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 最长快乐字符串 =====");
console.log("堆:", longestDiverseString(1, 1, 7)); // 期望 "ccaccbcc" 或类似
console.log("贪心:", longestDiverseStringGreedy(2, 2, 1)); // 期望 "aabbc" 或类似

export {};
