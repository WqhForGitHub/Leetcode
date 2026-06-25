// ============================================================
// 053. 最多能完成排序的块 II
// ============================================================
// LeetCode 768. Max Chunks To Make Sorted II
// 给定一个可能含重复元素的数组 arr，将其分成最多连续块，每块单独排序后拼接等于整体排序。求最多块数。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 维护每个块的最大值（单调递增栈）。当前元素小于栈顶最大值时合并块，
// 直到栈顶最大值不大于当前元素。时间 O(n)，空间 O(n)。
function maxChunksToSorted(arr: number[]): number {
  const stack: number[] = []; // 存每块最大值，单调递增
  for (const num of arr) {
    if (stack.length === 0 || num >= stack[stack.length - 1]) {
      stack.push(num);
    } else {
      // 合并块
      const max = stack.pop()!;
      while (stack.length > 0 && stack[stack.length - 1] > num) {
        stack.pop();
      }
      stack.push(max);
    }
  }
  return stack.length;
}

// ------------------------------------------------------------
// 方法2：前缀最大值 vs 排序后前缀和
// ------------------------------------------------------------
function maxChunksToSortedPrefix(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  let chunks = 0;
  let sum1 = 0,
    sum2 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum1 += arr[i];
    sum2 += sorted[i];
    if (sum1 === sum2) chunks++;
  }
  return chunks;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', maxChunksToSorted([5, 4, 3, 2, 1]), '期望: 1');
  console.log('测试2 - 栈法:', maxChunksToSorted([2, 1, 3, 4, 4]), '期望: 4');
  console.log('测试3 - 前缀:', maxChunksToSortedPrefix([1, 1, 0, 0, 1]), '期望: 2');
}

test();

export {};
