// ============================================================
// 069. LCR 076. 数组中的第 K 个最大元素
// ============================================================
// LeetCode 215. Kth Largest Element in an Array
// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 注意，要求找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
// 时间复杂度：O(n) 平均, 空间复杂度：O(log n)

// 方法1：快速选择（分治）（推荐）
// 利用快速排序的 partition 思想，每次划分后只递归包含目标位置的一侧
// 时间复杂度 O(n) 平均，空间复杂度 O(log n) 递归栈
function findKthLargestQuickselect(nums: number[], k: number): number {
  const target: number = nums.length - k; // 第 k 大 = 升序第 n-k 个

  function partition(left: number, right: number, pivotIndex: number): number {
    const pivot: number = nums[pivotIndex];
    [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];
    let storeIndex: number = left;
    for (let i: number = left; i < right; i++) {
      if (nums[i] < pivot) {
        [nums[i], nums[storeIndex]] = [nums[storeIndex], nums[i]];
        storeIndex++;
      }
    }
    [nums[storeIndex], nums[right]] = [nums[right], nums[storeIndex]];
    return storeIndex;
  }

  function quickselect(left: number, right: number): number {
    if (left === right) {
      return nums[left];
    }
    const pivotIndex: number = left + Math.floor(Math.random() * (right - left + 1));
    const newPivot: number = partition(left, right, pivotIndex);
    if (newPivot === target) {
      return nums[newPivot];
    } else if (newPivot < target) {
      return quickselect(newPivot + 1, right);
    } else {
      return quickselect(left, newPivot - 1);
    }
  }

  return quickselect(0, nums.length - 1);
}

// 方法2：大小为 k 的最小堆
// 维护大小为 k 的最小堆，遍历结束后堆顶即为第 k 大
// 时间复杂度 O(n log k)，空间复杂度 O(k)
function findKthLargestHeap(nums: number[], k: number): number {
  class MinHeap {
    private data: number[] = [];

    private siftUp(i: number): void {
      while (i > 0) {
        const parent: number = Math.floor((i - 1) / 2);
        if (this.data[i] < this.data[parent]) {
          [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
          i = parent;
        } else {
          break;
        }
      }
    }

    private siftDown(i: number): void {
      const n: number = this.data.length;
      while (true) {
        let smallest: number = i;
        const left: number = 2 * i + 1;
        const right: number = 2 * i + 2;
        if (left < n && this.data[left] < this.data[smallest]) {
          smallest = left;
        }
        if (right < n && this.data[right] < this.data[smallest]) {
          smallest = right;
        }
        if (smallest !== i) {
          [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
          i = smallest;
        } else {
          break;
        }
      }
    }

    push(val: number): void {
      this.data.push(val);
      this.siftUp(this.data.length - 1);
    }

    pop(): number {
      const top: number = this.data[0];
      const last: number = this.data.pop()!;
      if (this.data.length > 0) {
        this.data[0] = last;
        this.siftDown(0);
      }
      return top;
    }

    peek(): number {
      return this.data[0];
    }

    size(): number {
      return this.data.length;
    }
  }

  const heap: MinHeap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) {
      heap.pop();
    }
  }
  return heap.peek();
}

// 方法3：排序
// 升序排序后取倒数第 k 个
// 时间复杂度 O(n log n)，空间复杂度 O(log n)
function findKthLargestSort(nums: number[], k: number): number {
  const sorted: number[] = [...nums].sort((a, b) => a - b);
  return sorted[sorted.length - k];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. LCR 076. 数组中的第 K 个最大元素 =====");
console.log(findKthLargestQuickselect([3, 2, 1, 5, 6, 4], 2)); // 期望结果: 5
console.log(findKthLargestQuickselect([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望结果: 4
console.log(findKthLargestQuickselect([1], 1)); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(findKthLargestHeap([3, 2, 1, 5, 6, 4], 2)); // 期望结果: 5
console.log(findKthLargestHeap([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望结果: 4
console.log("--- 方法3测试 ---");
console.log(findKthLargestSort([3, 2, 1, 5, 6, 4], 2)); // 期望结果: 5

export {};
