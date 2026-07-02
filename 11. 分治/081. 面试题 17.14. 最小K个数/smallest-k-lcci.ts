// ============================================================
// 081. 面试题 17.14. 最小K个数
// ============================================================
// LeetCode 面试题 17.14 / 215. Smallest K
// 给定数组 arr 和整数 k，返回数组中最小的 k 个数（任意顺序）。
// 时间复杂度：O(n) 平均, 空间复杂度：O(log n)

// 方法1：快速选择（分治）（推荐）
// 利用快排 partition 找到第 k 小元素的分界点，前 k 个即为所求
// 时间复杂度 O(n) 平均，空间复杂度 O(log n) 递归栈
function smallestKQuickselect(arr: number[], k: number): number[] {
  if (k === 0) {
    return [];
  }
  const target: number = k - 1; // 目标位置元素是第 k 小

  function partition(left: number, right: number, pivotIndex: number): number {
    const pivot: number = arr[pivotIndex];
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    let storeIndex: number = left;
    for (let i: number = left; i < right; i++) {
      if (arr[i] < pivot) {
        [arr[i], arr[storeIndex]] = [arr[storeIndex], arr[i]];
        storeIndex++;
      }
    }
    [arr[storeIndex], arr[right]] = [arr[right], arr[storeIndex]];
    return storeIndex;
  }

  function quickselect(left: number, right: number): void {
    if (left >= right) {
      return;
    }
    const pivotIndex: number = left + Math.floor(Math.random() * (right - left + 1));
    const newPivot: number = partition(left, right, pivotIndex);
    if (newPivot === target) {
      return;
    } else if (newPivot < target) {
      quickselect(newPivot + 1, right);
    } else {
      quickselect(left, newPivot - 1);
    }
  }

  quickselect(0, arr.length - 1);
  return arr.slice(0, k);
}

// 方法2：大小为 k 的最大堆
// 维护大小为 k 的最大堆，遍历结束后堆中即为最小 k 个
// 时间复杂度 O(n log k)，空间复杂度 O(k)
function smallestKHeap(arr: number[], k: number): number[] {
  if (k === 0) {
    return [];
  }

  class MaxHeap {
    private data: number[] = [];

    private siftUp(i: number): void {
      while (i > 0) {
        const parent: number = Math.floor((i - 1) / 2);
        if (this.data[i] > this.data[parent]) {
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
        let largest: number = i;
        const left: number = 2 * i + 1;
        const right: number = 2 * i + 2;
        if (left < n && this.data[left] > this.data[largest]) {
          largest = left;
        }
        if (right < n && this.data[right] > this.data[largest]) {
          largest = right;
        }
        if (largest !== i) {
          [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
          i = largest;
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

    toArray(): number[] {
      return [...this.data];
    }
  }

  const heap: MaxHeap = new MaxHeap();
  for (const num of arr) {
    heap.push(num);
    if (heap.size() > k) {
      heap.pop();
    }
  }
  return heap.toArray();
}

// 方法3：排序
// 升序排序后取前 k 个
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function smallestKSort(arr: number[], k: number): number[] {
  return [...arr].sort((a, b) => a - b).slice(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 面试题 17.14. 最小K个数 =====");
console.log(smallestKQuickselect([1, 3, 5, 7, 2, 4, 6, 8], 4).sort((a, b) => a - b)); // 期望结果: [1, 2, 3, 4]
console.log(smallestKQuickselect([1, 2, 3], 0)); // 期望结果: []
console.log(smallestKQuickselect([5], 1).sort((a, b) => a - b)); // 期望结果: [5]
console.log("--- 方法2测试 ---");
console.log(smallestKHeap([1, 3, 5, 7, 2, 4, 6, 8], 4).sort((a, b) => a - b)); // 期望结果: [1, 2, 3, 4]
console.log(smallestKHeap([1, 2, 3], 0)); // 期望结果: []
console.log("--- 方法3测试 ---");
console.log(smallestKSort([1, 3, 5, 7, 2, 4, 6, 8], 4)); // 期望结果: [1, 2, 3, 4]

export {};
