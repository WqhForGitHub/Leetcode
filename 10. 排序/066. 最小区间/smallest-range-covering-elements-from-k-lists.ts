// ============================================================
// 066. 最小区间
// ============================================================
// LeetCode 632. Smallest Range Covering Elements from K Lists
// 给定 k 个已排序的整数列表，找到一个最小区间 [a, b]，
// 使得每个列表中至少有一个数落在该区间内。返回该区间。

// 方法1：合并所有元素（带列表编号）+ 排序 + 滑动窗口（O(n log n) 时间，O(n) 空间）
// 思路：
//   1. 把所有列表的元素合并，每个元素记录 (值, 所属列表编号)。
//   2. 按值升序排序。
//   3. 用滑动窗口在合并数组上移动，窗口内需覆盖全部 k 个列表编号。
//   4. 维护每个列表编号在窗口中的出现次数和已覆盖列表数，
//      当覆盖数 == k 时尝试收缩左端，更新最小区间。
function smallestRange(nums: number[][]): number[] {
  // 合并所有元素 (value, listId)
  const merged: Array<{ val: number; listId: number }> = [];
  for (let i = 0; i < nums.length; i++) {
    for (const v of nums[i]) {
      merged.push({ val: v, listId: i });
    }
  }
  merged.sort((a, b) => a.val - b.val);

  const k = nums.length;
  const count = new Map<number, number>(); // listId -> 出现次数
  let covered = 0; // 当前窗口覆盖的列表数
  let left = 0;
  let bestStart = -1e5;
  let bestEnd = 1e5;

  for (let right = 0; right < merged.length; right++) {
    const rItem = merged[right];
    const rCount = count.get(rItem.listId) ?? 0;
    count.set(rItem.listId, rCount + 1);
    if (rCount === 0) covered++;

    // 当覆盖全部列表时，尝试收缩左端
    while (covered === k) {
      const lItem = merged[left];
      // 更新最优区间（更短，或长度相同但起点更小）
      if (rItem.val - lItem.val < bestEnd - bestStart) {
        bestStart = lItem.val;
        bestEnd = rItem.val;
      }
      const lCount = count.get(lItem.listId)!;
      count.set(lItem.listId, lCount - 1);
      if (lCount - 1 === 0) covered--;
      left++;
    }
  }

  return [bestStart, bestEnd];
}

// 方法2：k 个指针的最小堆（O(n log k) 时间，O(k) 空间）
// 思路：
//   1. 每个列表维护一个指针，初始指向各自第一个元素。
//   2. 用最小堆维护 k 个指针当前所指元素，同时维护当前最大值。
//   3. 当前区间即为 [堆顶最小值, 当前最大值]。
//   4. 每次弹出堆顶（最小值），用同一列表的下一个元素替换入堆，
//      更新最大值，并尝试更新最优区间。
//   5. 当某个列表耗尽时停止。
class MinHeapEntry {
  constructor(
    public val: number,
    public listId: number,
    public idx: number,
  ) {}
}

class MinHeapRange {
  private data: MinHeapEntry[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): MinHeapEntry {
    return this.data[0];
  }

  push(entry: MinHeapEntry): void {
    this.data.push(entry);
    this.siftUp(this.data.length - 1);
  }

  pop(): MinHeapEntry {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent].val <= this.data[i].val) break;
      const tmp = this.data[parent];
      this.data[parent] = this.data[i];
      this.data[i] = tmp;
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.data[left].val < this.data[smallest].val) smallest = left;
      if (right < n && this.data[right].val < this.data[smallest].val) smallest = right;
      if (smallest === i) break;
      const tmp = this.data[smallest];
      this.data[smallest] = this.data[i];
      this.data[i] = tmp;
      i = smallest;
    }
  }
}

function smallestRangeHeap(nums: number[][]): number[] {
  const k = nums.length;
  const heap = new MinHeapRange();
  let curMax = -Infinity;

  // 初始化：每个列表的第一个元素入堆
  for (let i = 0; i < k; i++) {
    heap.push(new MinHeapEntry(nums[i][0], i, 0));
    curMax = Math.max(curMax, nums[i][0]);
  }

  let bestStart = -1e5;
  let bestEnd = 1e5;

  while (heap.size() === k) {
    const minEntry = heap.pop();
    const curMin = minEntry.val;

    // 更新最优区间
    if (curMax - curMin < bestEnd - bestStart) {
      bestStart = curMin;
      bestEnd = curMax;
    }

    // 取该列表下一个元素
    const nextIdx = minEntry.idx + 1;
    const listId = minEntry.listId;
    if (nextIdx < nums[listId].length) {
      const nextVal = nums[listId][nextIdx];
      heap.push(new MinHeapEntry(nextVal, listId, nextIdx));
      curMax = Math.max(curMax, nextVal);
    } else {
      // 该列表耗尽，无法再覆盖所有列表
      break;
    }
  }

  return [bestStart, bestEnd];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 最小区间 =====");
console.log("滑动窗口 [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]:",
  smallestRange([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]])); // 期望 [20,24]
console.log("滑动窗口 [[1,2,3],[1,2,3],[1,2,3]]:",
  smallestRange([[1, 2, 3], [1, 2, 3], [1, 2, 3]])); // 期望 [1,1]
console.log("最小堆 [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]:",
  smallestRangeHeap([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]])); // 期望 [20,24]
console.log("最小堆 [[1,2,3],[1,2,3],[1,2,3]]:",
  smallestRangeHeap([[1, 2, 3], [1, 2, 3], [1, 2, 3]])); // 期望 [1,1]

export {};
