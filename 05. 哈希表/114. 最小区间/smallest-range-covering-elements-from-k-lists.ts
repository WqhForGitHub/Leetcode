// ============================================================
// 114. 最小区间
// ============================================================
// LeetCode 632. Smallest Range Covering Elements from K Lists
// 给定 k 个升序整数列表，找到最小区间 [a, b]，使每个列表至少有一个数在该区间内。
// 时间复杂度：O(N log k)，N 为总元素数；空间复杂度：O(k)

// 思路：最小堆 + 滑动窗口
// 维护堆中来自每个列表的一个元素，堆顶为当前最小值，跟踪当前最大值
// 区间 = [堆顶最小, 当前最大]，不断弹出最小、加入同列表下一个元素
function smallestRange(nums: number[][]): number[] {
  // 最小堆元素：[值, 列表索引, 元素索引]
  // 使用排序数组模拟，简化实现
  type Entry = { val: number; listIdx: number; elemIdx: number };
  const heap: Entry[] = [];
  let curMax = -Infinity;

  // 初始化：每个列表的第一个元素入堆
  for (let i = 0; i < nums.length; i++) {
    heap.push({ val: nums[i][0], listIdx: i, elemIdx: 0 });
    curMax = Math.max(curMax, nums[i][0]);
  }
  heap.sort((a, b) => a.val - b.val);

  let bestStart = -1e5;
  let bestEnd = 1e5;

  while (true) {
    // 堆顶为当前最小
    const min = heap[0];
    const curStart = min.val;

    // 更新最小区间
    if (curMax - curStart < bestEnd - bestStart) {
      bestStart = curStart;
      bestEnd = curMax;
    }

    // 弹出堆顶，加入同列表下一个元素
    const { listIdx, elemIdx } = min;
    if (elemIdx + 1 >= nums[listIdx].length) {
      // 某列表耗尽，结束
      break;
    }
    heap.shift();
    const nextVal = nums[listIdx][elemIdx + 1];
    curMax = Math.max(curMax, nextVal);
    // 插入并保持有序
    heap.push({ val: nextVal, listIdx, elemIdx: elemIdx + 1 });
    heap.sort((a, b) => a.val - b.val);
  }

  return [bestStart, bestEnd];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 114. 最小区间 =====");
// 测试 1
console.log(smallestRange([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]])); // 期望: [20, 24]
// 测试 2
console.log(smallestRange([[1, 2, 3], [1, 2, 3], [1, 2, 3]])); // 期望: [1, 1]

export {};
