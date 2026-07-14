// ============================================================
// 135. 下一个更大元素 IV
// ============================================================
// LeetCode 2454. Next Greater Element IV
// 对每个元素找第二个比它大的元素。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：单调栈 + 最小堆
function secondGreaterElement(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = []; // 单调递减栈
  const heap: Array<[number, number]> = []; // 最小堆 [value, index]

  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s][0]) s = l;
      if (r < len && heap[r][0] < heap[s][0]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };

  for (let i = 0; i < n; i++) {
    // 处理堆中所有比 nums[i] 小的元素
    while (heap.length > 0 && heap[0][0] < nums[i]) {
      result[heap[0][1]] = nums[i];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown();
    }
    // 将栈顶元素移到堆中
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop()!;
      heap.push([nums[idx], idx]);
      siftUp(heap.length - 1);
    }
    stack.push(i);
  }
  return result;
}

// 方法2：两个单调栈
function secondGreaterElementTwoStack(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(-1);
  const s1: number[] = [];
  const s2: number[] = [];
  const temp: number[] = [];
  for (let i = 0; i < n; i++) {
    while (s2.length > 0 && nums[s2[s2.length - 1]] < nums[i]) {
      result[s2.pop()!] = nums[i];
    }
    while (s1.length > 0 && nums[s1[s1.length - 1]] < nums[i]) {
      temp.push(s1.pop()!);
    }
    while (temp.length > 0) {
      s2.push(temp.pop()!);
    }
    s1.push(i);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 135. 下一个更大元素 IV =====");
console.log("栈+堆:", secondGreaterElement([2, 4, 0, 9, 6])); // 期望 [9,6,6,-1,-1]
console.log("双栈:", secondGreaterElementTwoStack([3, 3, 3, 3])); // 期望 [-1,-1,-1,-1]

export {};
