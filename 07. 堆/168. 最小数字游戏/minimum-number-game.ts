// ============================================================
// 168. 最小数字游戏
// ============================================================
// LeetCode 2974. Minimum Number Game
// 每次两个玩家选最小数字，然后交换，返回结果数组。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆
function numberGame(nums: number[]): number[] {
  const heap: number[] = [...nums];
  const result: number[] = [];
  const siftDown = (i: number, len: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l] < heap[s]) s = l;
      if (r < len && heap[r] < heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i, heap.length);
  while (heap.length >= 2) {
    const alice = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    const bob = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown(0, heap.length);
    result.push(bob, alice);
  }
  return result;
}

// 方法2：排序 + 交换相邻对
function numberGameSort(nums: number[]): number[] {
  nums.sort((a, b) => a - b);
  for (let i = 0; i + 1 < nums.length; i += 2) {
    [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
  }
  return nums;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 168. 最小数字游戏 =====");
console.log("堆:", numberGame([5, 4, 2, 3])); // 期望 [3,2,5,4]
console.log("排序:", numberGameSort([2, 5])); // 期望 [5,2]

export {};
