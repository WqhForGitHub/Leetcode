// ============================================================
// 075. LCR 159. 库存管理 III
// ============================================================
// LeetCode 面试题 17.14 / LCR 159. 库存管理 III
// 给定数组 stock 和整数 cnt，返回数组中最小的 cnt 个元素（任意顺序）。
// 时间复杂度：O(n) 平均, 空间复杂度：O(log n)

// 方法1：快速选择（分治）（推荐）
// 利用快排 partition 找到第 cnt 小元素的分界点，前 cnt 个即为所求
// 时间复杂度 O(n) 平均，空间复杂度 O(log n) 递归栈
function inventoryManagementQuickselect(stock: number[], cnt: number): number[] {
  if (cnt === 0) {
    return [];
  }
  const target: number = cnt - 1; // 目标位置的元素是第 cnt 小

  function partition(left: number, right: number, pivotIndex: number): number {
    const pivot: number = stock[pivotIndex];
    [stock[pivotIndex], stock[right]] = [stock[right], stock[pivotIndex]];
    let storeIndex: number = left;
    for (let i: number = left; i < right; i++) {
      if (stock[i] < pivot) {
        [stock[i], stock[storeIndex]] = [stock[storeIndex], stock[i]];
        storeIndex++;
      }
    }
    [stock[storeIndex], stock[right]] = [stock[right], stock[storeIndex]];
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

  quickselect(0, stock.length - 1);
  return stock.slice(0, cnt);
}

// 方法2：大小为 cnt 的最大堆
// 维护大小为 cnt 的最大堆，遍历结束后堆中即为最小 cnt 个
// 时间复杂度 O(n log cnt)，空间复杂度 O(cnt)
function inventoryManagementHeap(stock: number[], cnt: number): number[] {
  if (cnt === 0) {
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
  for (const num of stock) {
    heap.push(num);
    if (heap.size() > cnt) {
      heap.pop();
    }
  }
  return heap.toArray();
}

// 方法3：排序
// 升序排序后取前 cnt 个
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function inventoryManagementSort(stock: number[], cnt: number): number[] {
  return [...stock].sort((a, b) => a - b).slice(0, cnt);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. LCR 159. 库存管理 III =====");
console.log(inventoryManagementQuickselect([2, 5, 7, 4], 1).sort((a, b) => a - b)); // 期望结果: [2]
console.log(
  inventoryManagementQuickselect([0, 0, 1, 2, 4, 2, 2, 3, 1, 0], 4).sort((a, b) => a - b),
); // 期望结果: [0, 0, 0, 1]
console.log(inventoryManagementQuickselect([0, 0, 1, 3, 4, 5, 0, 1, 1], 1).sort((a, b) => a - b)); // 期望结果: [0]
console.log("--- 方法2测试 ---");
console.log(inventoryManagementHeap([2, 5, 7, 4], 1).sort((a, b) => a - b)); // 期望结果: [2]
console.log(inventoryManagementHeap([0, 0, 1, 2, 4, 2, 2, 3, 1, 0], 4).sort((a, b) => a - b)); // 期望结果: [0, 0, 0, 1]
console.log("--- 方法3测试 ---");
console.log(inventoryManagementSort([2, 5, 7, 4], 1)); // 期望结果: [2]

export {};
