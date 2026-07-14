// ============================================================
// 088. 滑动窗口中位数
// ============================================================
// LeetCode 480. Sliding Window Median
// 给定数组和窗口大小 k，返回每个滑动窗口的中位数
// 思路：双堆（大顶堆存较小半 + 小顶堆存较大半）+ 哈希表延迟删除
// 时间复杂度：O(n log k)，空间复杂度：O(k)

// 二叉堆（可配置为最大堆或最小堆）
class Heap {
  private data: number[] = [];
  private isMax: boolean;

  constructor(isMax: boolean) {
    this.isMax = isMax;
  }

  private compare(a: number, b: number): boolean {
    return this.isMax ? a > b : a < b;
  }

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
      if (this.compare(this.data[i], this.data[parent])) {
        [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let best = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.compare(this.data[left], this.data[best])) best = left;
      if (right < n && this.compare(this.data[right], this.data[best])) best = right;
      if (best !== i) {
        [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
        i = best;
      } else {
        break;
      }
    }
  }
}

function medianSlidingWindow(nums: number[], k: number): number[] {
  const lo = new Heap(true); // 大顶堆，存较小的一半
  const hi = new Heap(false); // 小顶堆，存较大的一半
  const delayed = new Map<number, number>(); // 延迟删除计数
  let balance = 0; // lo 有效大小 - hi 有效大小

  // 清理堆顶已标记删除的元素
  const prune = (heap: Heap): void => {
    while (heap.size() > 0) {
      const top = heap.peek()!;
      if ((delayed.get(top) ?? 0) > 0) {
        delayed.set(top, (delayed.get(top) ?? 0) - 1);
        if (delayed.get(top) === 0) delayed.delete(top);
        heap.pop();
      } else {
        break;
      }
    }
  };

  // 平衡两个堆
  const rebalance = (): void => {
    prune(lo);
    prune(hi);
    if (balance > 1) {
      hi.push(lo.pop()!);
      balance -= 2;
      prune(lo);
    } else if (balance < 0) {
      lo.push(hi.pop()!);
      balance += 2;
      prune(hi);
    }
    prune(lo);
    prune(hi);
  };

  // 添加元素
  const add = (num: number): void => {
    if (lo.size() === 0 || num <= lo.peek()!) {
      lo.push(num);
      balance++;
    } else {
      hi.push(num);
      balance--;
    }
    rebalance();
  };

  // 延迟删除元素
  const remove = (num: number): void => {
    delayed.set(num, (delayed.get(num) ?? 0) + 1);
    if (lo.size() > 0 && num <= lo.peek()!) {
      balance--;
    } else {
      balance++;
    }
    rebalance();
  };

  // 获取当前窗口中位数
  const getMedian = (): number => {
    prune(lo);
    prune(hi);
    if (k % 2 === 1) {
      return lo.peek()!;
    } else {
      return (lo.peek()! + hi.peek()!) / 2;
    }
  };

  const result: number[] = [];

  // 初始化前 k 个元素
  for (let i = 0; i < k; i++) {
    add(nums[i]);
  }
  result.push(getMedian());

  // 滑动窗口
  for (let i = k; i < nums.length; i++) {
    add(nums[i]);
    remove(nums[i - k]);
    result.push(getMedian());
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 滑动窗口中位数 =====");
console.log(medianSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 期望输出: [1, -1, -1, 3, 5, 6]
console.log(medianSlidingWindow([1, 2, 3, 4, 2, 3, 1, 4, 2], 3)); // 期望输出: [2, 3, 3, 3, 2, 3, 2]
console.log(medianSlidingWindow([1, 2], 1)); // 期望输出: [1, 2]
console.log(medianSlidingWindow([1, 2, 3, 4], 2)); // 期望输出: [1.5, 2.5, 3.5]

export {};
