// ============================================================
// 121. 最小差值平方和
// ============================================================
// LeetCode 2333. Minimum Sum of Squared Difference
// 给定两个数组，可以修改元素，使两数组对应位置差的平方和最小。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：贪心 + 最大堆
function minSumSquareDiff(nums1: number[], nums2: number[], k1: number, k2: number): number {
  const n = nums1.length;
  const diffs: number[] = [];
  for (let i = 0; i < n; i++) {
    diffs.push(Math.abs(nums1[i] - nums2[i]));
  }
  diffs.sort((a, b) => b - a);
  const totalOps = k1 + k2;
  // 把差值数组用最大堆处理，每次减最大的
  const maxHeap: number[] = [...diffs];
  // 建堆
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && maxHeap[l] > maxHeap[s]) s = l;
      if (r < len && maxHeap[r] > maxHeap[s]) s = r;
      if (s !== i) { [maxHeap[i], maxHeap[s]] = [maxHeap[s], maxHeap[i]]; i = s; }
      else break;
    }
  };
  for (let i = Math.floor(maxHeap.length / 2) - 1; i >= 0; i--) siftDown(i, maxHeap.length);
  let ops = totalOps;
  while (ops > 0 && maxHeap[0] > 0) {
    // 处理一层
    const top = maxHeap[0];
    let count = 0;
    while (count < maxHeap.length && maxHeap[count] === top) count++;
    const next = count < maxHeap.length ? maxHeap[count] : 0;
    const layer = top - next;
    const total = layer * count;
    if (total <= ops) {
      ops -= total;
      for (let i = 0; i < count; i++) {
        maxHeap[i] = next;
      }
    } else {
      const each = Math.floor(ops / count);
      const rem = ops % count;
      for (let i = 0; i < count; i++) {
        maxHeap[i] = top - each - (i < rem ? 1 : 0);
      }
      ops = 0;
    }
    siftDown(0, maxHeap.length);
  }
  let result = 0;
  for (const d of maxHeap) result += BigInt(d) * BigInt(d);
  return Number(result);
}

// 方法2：排序 + 贪心
function minSumSquareDiffSort(nums1: number[], nums2: number[], k1: number, k2: number): number {
  const n = nums1.length;
  const diffs: number[] = [];
  for (let i = 0; i < n; i++) {
    diffs.push(Math.abs(nums1[i] - nums2[i]));
  }
  diffs.sort((a, b) => b - a);
  diffs.push(0); // 哨兵
  let ops = k1 + k2;
  for (let i = 0; i < n && ops > 0; i++) {
    const cur = diffs[i];
    const next = diffs[i + 1] || 0;
    const count = i + 1;
    const layer = cur - next;
    if (layer * count <= ops) {
      ops -= layer * count;
      for (let j = 0; j <= i; j++) diffs[j] = next;
    } else {
      const each = Math.floor(ops / count);
      const rem = ops % count;
      for (let j = 0; j <= i; j++) {
        diffs[j] = cur - each - (j < rem ? 1 : 0);
      }
      ops = 0;
    }
  }
  let result = 0n;
  for (let i = 0; i < n; i++) result += BigInt(diffs[i]) * BigInt(diffs[i]);
  return Number(result);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 121. 最小差值平方和 =====");
console.log("堆:", minSumSquareDiff([1, 2, 3, 4], [2, 10, 20, 19], 0, 0)); // 期望 579
console.log("排序:", minSumSquareDiffSort([1, 4, 10, 12], [5, 8, 6, 9], 1, 1)); // 期望 43

export {};
