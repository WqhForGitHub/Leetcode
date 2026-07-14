// ============================================================
// 084. 最多能完成排序的块 II
// ============================================================
// LeetCode 768. Max Chunks To Make Sorted II
// 给定数组（可能含重复元素），将其分成最多若干块，每块单独排序后拼接
// 能得到全局排序数组。求最大块数。

// 方法1：排序 + 前缀和比较（推荐，O(n log n)）
// 思路：对数组排序得到目标数组，逐个位置比较原数组和排序数组的
//       前缀和。当前缀和相等时，说明前缀的多重集合相同，可以在此切分。
function maxChunksToSorted(arr: number[]): number {
  const n = arr.length;
  const sorted = [...arr].sort((a, b) => a - b);

  let sum1 = 0;
  let sum2 = 0;
  let count = 0;

  for (let i = 0; i < n; i++) {
    sum1 += arr[i];
    sum2 += sorted[i];
    // 前缀和相等 => 前缀多重集合相同 => 可以在此处切分
    if (sum1 === sum2) {
      count++;
    }
  }

  return count;
}

// 方法2：单调栈（O(n)）
// 思路：维护一个栈，栈中存储每个块的最大值。遇到新元素时：
//   - 若新元素 >= 栈顶（当前块最大值），则新元素可独立成块，入栈
//   - 若新元素 < 栈顶，则需合并所有最大值 > 新元素的块，
//     合并后块的最大值为被合并块中的最大值（即第一个被弹出的栈顶）
function maxChunksToSorted2(arr: number[]): number {
  const stack: number[] = []; // 栈中存储每个块的最大值

  for (const x of arr) {
    if (stack.length === 0 || x >= stack[stack.length - 1]) {
      // 新元素不小于当前块最大值，可独立成块
      stack.push(x);
    } else {
      // 需要合并：弹出所有最大值 > x 的块
      const maxOfMerged = stack[stack.length - 1]; // 合并后块的最大值
      while (stack.length > 0 && stack[stack.length - 1] > x) {
        stack.pop();
      }
      stack.push(maxOfMerged); // 合并后的块入栈
    }
  }

  return stack.length;
}

// 方法3：排序 + 频率计数器比较（O(n log n)，更鲁棒无碰撞）
// 思路：与方法1类似，但用频率计数器代替前缀和，避免求和碰撞问题。
function maxChunksToSorted3(arr: number[]): number {
  const n = arr.length;
  const sorted = [...arr].sort((a, b) => a - b);

  const diff: Map<number, number> = new Map();
  let nonZero = 0; // 差异计数器中非零项的个数
  let count = 0;

  for (let i = 0; i < n; i++) {
    // 添加 arr[i]
    const before1 = diff.get(arr[i]) || 0;
    const after1 = before1 + 1;
    diff.set(arr[i], after1);
    if (before1 === 0) nonZero++;
    if (after1 === 0) nonZero--;

    // 移除 sorted[i]
    const before2 = diff.get(sorted[i]) || 0;
    const after2 = before2 - 1;
    diff.set(sorted[i], after2);
    if (before2 === 0) nonZero++;
    if (after2 === 0) nonZero--;

    // 差异计数器全为零 => 前缀多重集合相同 => 可切分
    if (nonZero === 0) count++;
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 最多能完成排序的块 II =====");

console.log("测试1:", maxChunksToSorted([5, 4, 3, 2, 1])); // 期望: 1
console.log("测试2:", maxChunksToSorted([2, 1, 3, 4, 4])); // 期望: 4
console.log("测试3:", maxChunksToSorted([1, 1, 0, 0, 1])); // 期望: 2

console.log("方法2测试1:", maxChunksToSorted2([5, 4, 3, 2, 1])); // 期望: 1
console.log("方法2测试2:", maxChunksToSorted2([2, 1, 3, 4, 4])); // 期望: 4
console.log("方法2测试3:", maxChunksToSorted2([1, 1, 0, 0, 1])); // 期望: 2

console.log("方法3测试1:", maxChunksToSorted3([5, 4, 3, 2, 1])); // 期望: 1
console.log("方法3测试2:", maxChunksToSorted3([2, 1, 3, 4, 4])); // 期望: 4

export {};
