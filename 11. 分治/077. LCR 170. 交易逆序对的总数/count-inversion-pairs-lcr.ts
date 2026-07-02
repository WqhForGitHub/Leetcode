// ============================================================
// 077. LCR 170. 交易逆序对的总数
// ============================================================
// LeetCode LCR 170 / 剑指 Offer 51. 交易逆序对的总数
// 给定数组 record，返回其中逆序对的数量。
// 逆序对：0 <= i < j < n 且 record[i] > record[j]。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

// 方法1：归并排序（分治）统计逆序对（推荐）
// 在归并排序合并阶段，当左半元素 > 右半元素时，左半剩余元素都构成逆序对
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function reversePairsMerge(record: number[]): number {
  const n: number = record.length;
  if (n < 2) {
    return 0;
  }
  const copy: number[] = [...record];
  const temp: number[] = new Array(n);
  return mergeSortCount(copy, 0, n - 1, temp);
}

function mergeSortCount(arr: number[], left: number, right: number, temp: number[]): number {
  if (left >= right) {
    return 0;
  }
  const mid: number = left + Math.floor((right - left) / 2);
  let count: number = 0;
  count += mergeSortCount(arr, left, mid, temp);
  count += mergeSortCount(arr, mid + 1, right, temp);

  // 合并阶段统计逆序对
  // 若 arr[i] > arr[j]，则 arr[i..mid] 都与 arr[j] 构成逆序对
  let i: number = left;
  let j: number = mid + 1;
  let k: number = left;
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      // arr[i] > arr[j]，左侧 i..mid 均大于 arr[j]
      count += mid - i + 1;
      temp[k++] = arr[j++];
    }
  }
  while (i <= mid) {
    temp[k++] = arr[i++];
  }
  while (j <= right) {
    temp[k++] = arr[j++];
  }
  for (let p: number = left; p <= right; p++) {
    arr[p] = temp[p];
  }
  return count;
}

// 方法2：树状数组 + 离散化
// 将值离散化后用树状数组统计右侧小于当前元素的个数
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function reversePairsBIT(record: number[]): number {
  const n: number = record.length;
  if (n < 2) {
    return 0;
  }

  // 离散化：将值映射为排名（从 1 开始）
  const sorted: number[] = [...new Set(record)].sort((a, b) => a - b);
  const rank: Map<number, number> = new Map();
  for (let i: number = 0; i < sorted.length; i++) {
    rank.set(sorted[i], i + 1);
  }

  // 树状数组
  const bit: number[] = new Array(sorted.length + 1).fill(0);

  function update(i: number, delta: number): void {
    while (i < bit.length) {
      bit[i] += delta;
      i += i & -i;
    }
  }

  function query(i: number): number {
    let sum: number = 0;
    while (i > 0) {
      sum += bit[i];
      i -= i & -i;
    }
    return sum;
  }

  let count: number = 0;
  // 从右往左遍历，统计已插入中比当前值小的个数
  for (let i: number = n - 1; i >= 0; i--) {
    const r: number = rank.get(record[i])!;
    // 查询严格小于当前值的个数（排名 r-1 及以下）
    count += query(r - 1);
    update(r, 1);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. LCR 170. 交易逆序对的总数 =====");
console.log(reversePairsMerge([9, 7, 5, 4, 6])); // 期望结果: 8
console.log(reversePairsMerge([7, 5, 6, 4])); // 期望结果: 5
console.log(reversePairsMerge([1, 2, 3])); // 期望结果: 0
console.log(reversePairsMerge([3, 2, 1])); // 期望结果: 3
console.log(reversePairsMerge([5])); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(reversePairsBIT([9, 7, 5, 4, 6])); // 期望结果: 8
console.log(reversePairsBIT([7, 5, 6, 4])); // 期望结果: 5
console.log(reversePairsBIT([3, 2, 1])); // 期望结果: 3

export {};
