// ============================================================
// 086. 第 K 个最小的质数分数
// ============================================================
// LeetCode 786. K-th Smallest Prime Fraction
// 给定排序的质数数组 arr，对所有 i < j 的分数 arr[i]/arr[j]，
// 找出第 k 小的分数。

// 方法1：二分搜索值 + 计数（推荐，O(n log W)，W 为值域范围）
// 思路：对分数值进行二分搜索，每次统计 <= mid 的分数个数。
//       使用双指针在 O(n) 内完成计数，同时记录 <= mid 的最大分数。
function kthSmallestPrimeFraction(arr: number[], k: number): number[] {
  const n = arr.length;
  let lo = 0;
  let hi = 1;
  let ans: number[] = [0, 1];

  while (hi - lo > 1e-9) {
    const mid = (lo + hi) / 2;
    let count = 0;
    // best 记录 <= mid 的最大分数 [分子, 分母]
    let best: number[] = [0, 1];
    let j = 1;

    for (let i = 0; i < n - 1; i++) {
      j = Math.max(j, i + 1);
      // 找到最小的 j 使得 arr[i]/arr[j] <= mid
      while (j < n && arr[i] / arr[j] > mid) {
        j++;
      }
      if (j < n) {
        // 所有 j' >= j 的分数 arr[i]/arr[j'] 都 <= mid
        count += n - j;
        // 更新 <= mid 的最大分数（用交叉乘法避免浮点误差）
        if (arr[i] * best[1] > best[0] * arr[j]) {
          best = [arr[i], arr[j]];
        }
      }
    }

    if (count >= k) {
      ans = best;
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return ans;
}

// 方法2：最小堆（O((n + k) log n)）
// 思路：对于每个分子 arr[i]，分数 arr[i]/arr[j] 随 j 增大而递减。
//       最小分数是 arr[i]/arr[n-1]。用最小堆合并这些有序列表。
//       初始将所有 [i, n-1] 入堆，每次弹出最小，然后推入 [i, j-1]。
function kthSmallestPrimeFraction2(arr: number[], k: number): number[] {
  const n = arr.length;

  // 最小堆，元素为 [分子索引, 分母索引]
  // 比较函数：arr[a[0]]/arr[a[1]] vs arr[b[0]]/arr[b[1]]
  // 用交叉乘法避免浮点误差
  const heap: number[][] = [];

  const compare = (a: number[], b: number[]): number => {
    return arr[a[0]] * arr[b[1]] - arr[b[0]] * arr[a[1]];
  };

  const push = (val: number[]): void => {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (compare(heap[i], heap[parent]) < 0) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
      } else {
        break;
      }
    }
  };

  const pop = (): number[] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < heap.length && compare(heap[left], heap[smallest]) < 0) {
          smallest = left;
        }
        if (right < heap.length && compare(heap[right], heap[smallest]) < 0) {
          smallest = right;
        }
        if (smallest !== i) {
          [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
          i = smallest;
        } else {
          break;
        }
      }
    }
    return top;
  };

  // 初始化：对每个分子索引 i，入堆 [i, n-1]（最小分母对应的分数）
  for (let i = 0; i < n - 1; i++) {
    push([i, n - 1]);
  }

  // 弹出 k 次，第 k 次即为答案
  let result: number[] = [0, 0];
  for (let t = 0; t < k; t++) {
    result = pop();
    const [i, j] = result;
    // 推入同一分子的下一个更大分数 [i, j-1]
    if (j - 1 > i) {
      push([i, j - 1]);
    }
  }

  return [arr[result[0]], arr[result[1]]];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 第 K 个最小的质数分数 =====");

console.log("测试1:", kthSmallestPrimeFraction([1, 2, 3, 5], 3)); // 期望: [2, 5]
console.log("测试2:", kthSmallestPrimeFraction([1, 7], 1)); // 期望: [1, 7]
console.log("测试3:", kthSmallestPrimeFraction([1, 2, 3, 5], 1)); // 期望: [1, 5]
console.log("测试4:", kthSmallestPrimeFraction([1, 2, 3, 5], 6)); // 期望: [2, 3] (2/3是第6小)

console.log("方法2测试1:", kthSmallestPrimeFraction2([1, 2, 3, 5], 3)); // 期望: [2, 5]
console.log("方法2测试2:", kthSmallestPrimeFraction2([1, 7], 1)); // 期望: [1, 7]
console.log("方法2测试3:", kthSmallestPrimeFraction2([1, 2, 3, 5], 1)); // 期望: [1, 5]
console.log("方法2测试4:", kthSmallestPrimeFraction2([1, 2, 3, 5], 6)); // 期望: [2, 3] (2/3是第6小)

export {};
