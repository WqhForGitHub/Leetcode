// ============================================================
// 039. 找出数组中的第 K 大整数
// ============================================================
// LeetCode 1985. Find the Kth Largest Integer in the Array
// 给定数字字符串数组 nums，所有数字互不相同，返回其中第 k 大的数字（以字符串形式）。
// 注意：数字可能非常大，无法用普通数值类型直接比较。
// 时间复杂度：O(n) 平均, 空间复杂度：O(log n)

// 字符串数字比较：先比长度，长度相同再字典序
function compareNumStr(a: string, b: string): number {
  if (a.length !== b.length) return a.length - b.length;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

// 方法1：快速选择 + 字符串比较（推荐）
// 利用快速选择在 O(n) 平均时间内找到第 k 大的元素
// 时间复杂度 O(n) 平均，空间复杂度 O(log n)
function kthLargestNumber(nums: string[], k: number): string {
  const arr: string[] = [...nums];

  function quickSelect(left: number, right: number, kIdx: number): string {
    if (left === right) return arr[left];
    const randIdx: number = left + Math.floor(Math.random() * (right - left + 1));
    const pivot: string = arr[randIdx];
    // 三路划分（降序：大的在前）
    [arr[randIdx], arr[left]] = [arr[left], arr[randIdx]];
    let lt: number = left;
    let gt: number = right;
    let i: number = left + 1;
    while (i <= gt) {
      const cmp: number = compareNumStr(arr[i], pivot);
      if (cmp > 0) {
        [arr[lt], arr[i]] = [arr[i], arr[lt]];
        lt++;
        i++;
      } else if (cmp < 0) {
        [arr[i], arr[gt]] = [arr[gt], arr[i]];
        gt--;
      } else {
        i++;
      }
    }
    if (kIdx < lt) return quickSelect(left, lt - 1, kIdx);
    if (kIdx > gt) return quickSelect(gt + 1, right, kIdx);
    return pivot;
  }

  return quickSelect(0, arr.length - 1, k - 1);
}

// 方法2：排序 + 字符串比较
// 按字符串数字大小降序排序，取第 k 个
// 时间复杂度 O(n log n * m)，m 为字符串长度；空间复杂度 O(n)
function kthLargestNumberSort(nums: string[], k: number): string {
  const arr: string[] = [...nums];
  arr.sort((a: string, b: string) => compareNumStr(b, a)); // 降序
  return arr[k - 1];
}

// 方法3：大小为 k 的最小堆
// 维护容量为 k 的最小堆（堆顶为堆中最小元素），遍历后堆顶即第 k 大
// 时间复杂度 O(n log k * m)，空间复杂度 O(k)
function kthLargestNumberHeap(nums: string[], k: number): string {
  const heap: string[] = [];

  function siftUp(idx: number): void {
    while (idx > 0) {
      const parent: number = Math.floor((idx - 1) / 2);
      if (compareNumStr(heap[parent], heap[idx]) > 0) {
        [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
        idx = parent;
      } else {
        break;
      }
    }
  }

  function siftDown(idx: number): void {
    const n: number = heap.length;
    while (true) {
      let smallest: number = idx;
      const l: number = 2 * idx + 1;
      const r: number = 2 * idx + 2;
      if (l < n && compareNumStr(heap[l], heap[smallest]) < 0) smallest = l;
      if (r < n && compareNumStr(heap[r], heap[smallest]) < 0) smallest = r;
      if (smallest !== idx) {
        [heap[smallest], heap[idx]] = [heap[idx], heap[smallest]];
        idx = smallest;
      } else {
        break;
      }
    }
  }

  for (const num of nums) {
    if (heap.length < k) {
      heap.push(num);
      siftUp(heap.length - 1);
    } else if (compareNumStr(num, heap[0]) > 0) {
      heap[0] = num;
      siftDown(0);
    }
  }
  return heap[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 找出数组中的第 K 大整数 =====");
console.log(kthLargestNumber(["3", "6", "7", "10"], 4)); // 期望结果: "3"
console.log(kthLargestNumber(["2", "21", "12", "1"], 3)); // 期望结果: "2"
console.log(kthLargestNumber(["0", "0"], 2)); // 期望结果: "0"
console.log(kthLargestNumber(["423", "521", "2", "42"], 2)); // 期望结果: "423"
console.log("--- 方法2测试 ---");
console.log(kthLargestNumberSort(["3", "6", "7", "10"], 4)); // 期望结果: "3"
console.log(kthLargestNumberSort(["2", "21", "12", "1"], 3)); // 期望结果: "2"
console.log("--- 方法3测试 ---");
console.log(kthLargestNumberHeap(["3", "6", "7", "10"], 4)); // 期望结果: "3"
console.log(kthLargestNumberHeap(["2", "21", "12", "1"], 3)); // 期望结果: "2"
console.log(kthLargestNumberHeap(["423", "521", "2", "42"], 2)); // 期望结果: "423"

export {};
