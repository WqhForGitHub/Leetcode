// ============================================================
// 068. LCR 060. 前 K 个高频元素
// ============================================================
// LeetCode 347. Top K Frequent Elements
// 给定一个整数数组 nums 和一个整数 k，请返回其中出现频率前 k 高的元素。
// 可以按任意顺序返回答案。
// 时间复杂度：O(n), 空间复杂度：O(n)

// 方法1：桶排序按频率分组（推荐）
// 统计每个元素频率，将元素按频率放入桶中，从高频到低频收集前 k 个
// 时间复杂度 O(n)，空间复杂度 O(n)
function topKFrequentBucket(nums: number[], k: number): number[] {
  // 统计频率
  const freqMap: Map<number, number> = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  }

  // 桶排序：下标为频率，值为该频率对应的所有元素
  const bucket: number[][] = new Array(nums.length + 1);
  for (let i: number = 0; i < bucket.length; i++) {
    bucket[i] = [];
  }
  for (const [num, freq] of freqMap) {
    bucket[freq].push(num);
  }

  // 从高频到低频收集前 k 个
  const result: number[] = [];
  for (let i: number = bucket.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of bucket[i]) {
      result.push(num);
      if (result.length === k) {
        break;
      }
    }
  }
  return result;
}

// 方法2：快速选择（分治）
// 将频率数组用快速选择算法找到前 k 大的元素
// 时间复杂度 O(n) 平均，空间复杂度 O(n)
function topKFrequentQuickselect(nums: number[], k: number): number[] {
  const freqMap: Map<number, number> = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  }

  const unique: number[] = Array.from(freqMap.keys());
  const freqOf: Map<number, number> = freqMap;

  // 分治：找前 k 大（即排序后第 unique.length - k 个位置之后）
  const target: number = unique.length - k;

  function partition(left: number, right: number, pivotIndex: number): number {
    const pivotFreq: number = freqOf.get(unique[pivotIndex])!;
    // 将 pivot 移到最右
    [unique[pivotIndex], unique[right]] = [unique[right], unique[pivotIndex]];
    let storeIndex: number = left;
    for (let i: number = left; i < right; i++) {
      if (freqOf.get(unique[i])! < pivotFreq) {
        [unique[i], unique[storeIndex]] = [unique[storeIndex], unique[i]];
        storeIndex++;
      }
    }
    [unique[storeIndex], unique[right]] = [unique[right], unique[storeIndex]];
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

  quickselect(0, unique.length - 1);
  return unique.slice(target);
}

// 方法3：最小堆（大小为 k）
// 维护大小为 k 的最小堆，按频率比较，最终堆中即为前 k 高频元素
// 时间复杂度 O(n log k)，空间复杂度 O(n)
function topKFrequentHeap(nums: number[], k: number): number[] {
  const freqMap: Map<number, number> = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  }

  // 最小堆：按频率升序排列
  class MinHeap {
    private data: number[] = [];

    private compare(a: number, b: number): number {
      return freqMap.get(a)! - freqMap.get(b)!;
    }

    private siftUp(i: number): void {
      while (i > 0) {
        const parent: number = Math.floor((i - 1) / 2);
        if (this.compare(this.data[i], this.data[parent]) < 0) {
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
        if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) {
          smallest = left;
        }
        if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) {
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

    pop(): number | undefined {
      const top: number = this.data[0];
      const last: number = this.data.pop()!;
      if (this.data.length > 0) {
        this.data[0] = last;
        this.siftDown(0);
      }
      return top;
    }

    size(): number {
      return this.data.length;
    }

    toArray(): number[] {
      return [...this.data];
    }
  }

  const heap: MinHeap = new MinHeap();
  for (const num of freqMap.keys()) {
    heap.push(num);
    if (heap.size() > k) {
      heap.pop();
    }
  }
  return heap.toArray();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. LCR 060. 前 K 个高频元素 =====");
console.log(topKFrequentBucket([1, 1, 1, 2, 2, 3], 2).sort()); // 期望结果: [1, 2]
console.log(topKFrequentBucket([1], 1)); // 期望结果: [1]
console.log(topKFrequentBucket([1, 1, 1, 2, 2, 3, 3, 3, 3], 1)); // 期望结果: [3]
console.log("--- 方法2测试 ---");
console.log(topKFrequentQuickselect([1, 1, 1, 2, 2, 3], 2).sort()); // 期望结果: [1, 2]
console.log(topKFrequentQuickselect([1], 1)); // 期望结果: [1]
console.log("--- 方法3测试 ---");
console.log(topKFrequentHeap([1, 1, 1, 2, 2, 3], 2).sort()); // 期望结果: [1, 2]
console.log(topKFrequentHeap([1], 1)); // 期望结果: [1]

export {};
