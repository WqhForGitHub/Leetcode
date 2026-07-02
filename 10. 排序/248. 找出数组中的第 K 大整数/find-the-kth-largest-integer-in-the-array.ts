// ============================================================
// 248. 找出数组中的第 K 大整数
// ============================================================
// LeetCode 1985. Find the Kth Largest Integer in the Array
// 给定数字字符串数组 nums，找出第 k 大的整数（数字可能非常大，需用 BigInt）。

// 方法1：排序 + BigInt 比较（O(n log n * L)）
function kthLargestNumber(nums: string[], k: number): string {
  const bigNums = nums.map((s) => BigInt(s));
  bigNums.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  return bigNums[k - 1].toString();
}

// 方法2：大小为 k 的最小堆（O(n log k * L)）
function kthLargestNumber2(nums: string[], k: number): string {
  // 维护大小为 k 的最小堆，堆顶是当前第 k 大
  const heap: bigint[] = [];
  const push = (val: bigint): void => {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] > heap[i]) {
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      } else break;
    }
  };
  const pop = (): bigint => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      const n = heap.length;
      while (true) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && heap[left] < heap[smallest]) smallest = left;
        if (right < n && heap[right] < heap[smallest]) smallest = right;
        if (smallest !== i) {
          [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
          i = smallest;
        } else break;
      }
    }
    return top;
  };

  for (const s of nums) {
    push(BigInt(s));
    if (heap.length > k) pop();
  }
  return heap[0].toString();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 248. 找出数组中的第 K 大整数 =====");
console.log("方法1:", kthLargestNumber(["3", "6", "7", "10"], 4)); // "3"
console.log("方法2:", kthLargestNumber2(["3", "6", "7", "10"], 4)); // "3"
console.log("方法1:", kthLargestNumber(["2", "21", "12", "1"], 3)); // "2"
console.log("方法2:", kthLargestNumber2(["2", "21", "12", "1"], 3)); // "2"
console.log("方法1:", kthLargestNumber(["0", "0"], 2)); // "0"
console.log("方法2:", kthLargestNumber2(["0", "0"], 2)); // "0"

export {};
