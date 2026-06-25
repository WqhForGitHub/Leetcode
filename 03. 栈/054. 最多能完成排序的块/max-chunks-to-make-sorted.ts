// ============================================================
// 054. 最多能完成排序的块
// ============================================================
// LeetCode 769. Max Chunks To Make Sorted
// arr 是 [0,1,...,n-1] 的排列，分成最多连续块，每块单独排序后拼接等于 [0,1,...,n-1]。

// ------------------------------------------------------------
// 方法1：前缀最大值
// ------------------------------------------------------------
// 当前块最大值等于其下标时，可在此处切块。
// 时间 O(n)，空间 O(1)。
function maxChunksToSorted(arr: number[]): number {
  let max = -1;
  let chunks = 0;
  for (let i = 0; i < arr.length; i++) {
    max = Math.max(max, arr[i]);
    if (max === i) chunks++;
  }
  return chunks;
}

// ------------------------------------------------------------
// 方法2：单调栈（通用写法）
// ------------------------------------------------------------
function maxChunksToSortedStack(arr: number[]): number {
  const stack: number[] = [];
  for (const num of arr) {
    if (stack.length === 0 || num >= stack[stack.length - 1]) {
      stack.push(num);
    } else {
      const max = stack.pop()!;
      while (stack.length > 0 && stack[stack.length - 1] > num) stack.pop();
      stack.push(max);
    }
  }
  return stack.length;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 前缀:', maxChunksToSorted([4, 3, 2, 1, 0]), '期望: 1');
  console.log('测试2 - 前缀:', maxChunksToSorted([1, 0, 2, 3, 4]), '期望: 4');
  console.log('测试3 - 栈法:', maxChunksToSortedStack([1, 2, 0, 3, 4]), '期望: 3');
}

test();

export {};
