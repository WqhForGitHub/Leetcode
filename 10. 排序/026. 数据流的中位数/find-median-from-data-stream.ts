// ============================================================
// 026. 数据流的中位数
// ============================================================
// LeetCode 295. Find Median from Data Stream
// 设计一个数据结构，支持 addNum 添加数字、findMedian 返回当前所有数字的中位数。

// ------------------------------------------------------------
// 小顶堆实现
// ------------------------------------------------------------
class MinHeap {
  private data: number[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): number | undefined {
    return this.data[0];
  }

  push(val: number): void {
    this.data.push(val);
    this.siftUp(this.data.length - 1);
  }

  pop(): number | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.data[left] < this.data[smallest]) smallest = left;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// ------------------------------------------------------------
// 大顶堆实现（基于小顶堆，存入负值）
// ------------------------------------------------------------
class MaxHeap {
  private minHeap = new MinHeap();

  size(): number {
    return this.minHeap.size();
  }

  peek(): number | undefined {
    const v = this.minHeap.peek();
    return v === undefined ? undefined : -v;
  }

  push(val: number): void {
    this.minHeap.push(-val);
  }

  pop(): number | undefined {
    const v = this.minHeap.pop();
    return v === undefined ? undefined : -v;
  }
}

// 方法1：双堆法（推荐，addNum O(log n)，findMedian O(1)）
// 大顶堆存较小的一半，小顶堆存较大的一半；保持大顶堆大小 >= 小顶堆大小且差值 <= 1。
class MedianFinderTwoHeaps {
  private lower = new MaxHeap(); // 较小一半的最大值在堆顶
  private upper = new MinHeap(); // 较大一半的最小值在堆顶

  addNum(num: number): void {
    // 先放入大顶堆（较小一侧），再把大顶堆堆顶平衡到小顶堆
    this.lower.push(num);
    this.upper.push(this.lower.pop()!);
    // 维持大小关系：lower 不少于 upper
    if (this.lower.size() < this.upper.size()) {
      this.lower.push(this.upper.pop()!);
    }
  }

  findMedian(): number {
    if (this.lower.size() > this.upper.size()) {
      return this.lower.peek()!;
    }
    return (this.lower.peek()! + this.upper.peek()!) / 2;
  }
}

// 方法2：有序数组 + 二分插入（addNum O(n)，findMedian O(1)）
// 维护一个有序数组，插入时用二分查找定位插入位置。
class MedianFinderSortedArray {
  private arr: number[] = [];

  addNum(num: number): void {
    // 二分查找第一个 > num 的位置
    let lo = 0;
    let hi = this.arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.arr[mid] <= num) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    this.arr.splice(lo, 0, num);
  }

  findMedian(): number {
    const n = this.arr.length;
    if (n % 2 === 1) {
      return this.arr[(n - 1) >> 1];
    }
    return (this.arr[n / 2 - 1] + this.arr[n / 2]) / 2;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 数据流的中位数 =====");

const mf1 = new MedianFinderTwoHeaps();
mf1.addNum(1);
mf1.addNum(2);
console.log("双堆 addNum(1,2) 中位数:", mf1.findMedian()); // 期望 1.5
mf1.addNum(3);
console.log("双堆 addNum(3) 中位数:", mf1.findMedian()); // 期望 2

const mf2 = new MedianFinderSortedArray();
mf2.addNum(1);
mf2.addNum(2);
console.log("有序数组 addNum(1,2) 中位数:", mf2.findMedian()); // 期望 1.5
mf2.addNum(3);
console.log("有序数组 addNum(3) 中位数:", mf2.findMedian()); // 期望 2

export {};
