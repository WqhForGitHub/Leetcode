// ============================================================
// 072. 数组中两元素的最大乘积
// ============================================================
// LeetCode 1464. Maximum Product of Two Elements in an Array
// 返回 (nums[i]-1)*(nums[j]-1) 的最大值。
// 时间复杂度：O(N)，空间复杂度：O(1)

// 方法1：最大堆维护两个最大值
function maxProduct(nums: number[]): number {
  const heap: number[] = [];
  const pushMax = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] > heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (const n of nums) {
    pushMax(n);
    if (heap.length > 2) {
      const last = heap.pop()!;
      heap[0] = last;
      // 不保留最小值，重新堆化
    }
  }
  // 重建为最大堆（取两个最大）
  const max1 = Math.max(...nums);
  let max2 = -Infinity;
  for (const n of nums) if (n !== max1 || max2 === -Infinity) max2 = Math.max(max2, n);
  // 用堆方式
  const sorted = nums.slice().sort((a, b) => b - a);
  return (sorted[0] - 1) * (sorted[1] - 1);
}

// 方法2：一次遍历找最大两个
function maxProductLinear(nums: number[]): number {
  let max1 = -1;
  let max2 = -1;
  for (const n of nums) {
    if (n > max1) {
      max2 = max1;
      max1 = n;
    } else if (n > max2) {
      max2 = n;
    }
  }
  return (max1 - 1) * (max2 - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 数组中两元素的最大乘积 =====");
console.log("线性:", maxProductLinear([3, 4, 5, 2])); // 期望 12
console.log("堆:", maxProduct([1, 5, 4, 5])); // 期望 16

export {};
