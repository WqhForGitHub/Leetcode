// ============================================================
// 041. 统计数组中好三元组数目
// ============================================================
// LeetCode 2179. Count Good Triplets in an Array
// 给定两个下标从 0 开始、长度为 n 的数组 nums1 和 nums2，二者均为 [0..n-1] 的排列。
// 记 pos1[v] 为 v 在 nums1 中的位置，pos2[v] 为 v 在 nums2 中的位置。
// 统计三元组 (x, y, z) 满足 0 <= x < y < z < n 且
// pos1[x] < pos1[y] < pos1[z] 且 pos2[x] < pos2[y] < pos2[z] 的总数目。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

// 方法1：树状数组（Fenwick Tree）（推荐）
// 令 b[pos1[v]] = pos2[v]。则原问题等价于：在数组 b 中统计下标 i<j<k
// 且 b[i]<b[j]<b[k] 的三元组个数。
// 以 j 为中间元素：left[j] = j 左侧比 b[j] 小的元素个数，
// right[j] = j 右侧比 b[j] 大的元素个数。答案 = Σ left[j]*right[j]。
// 两次扫描 + 树状数组即可，时间复杂度 O(n log n)，空间复杂度 O(n)
function goodTriplets(nums1: number[], nums2: number[]): number {
  const n: number = nums1.length;
  // pos2[v] = v 在 nums2 中的下标
  const pos2: number[] = new Array<number>(n).fill(0);
  for (let i: number = 0; i < n; i++) pos2[nums2[i]] = i;
  // b[i] = pos2[nums1[i]]，即按 nums1 的顺序排列的 nums2 位置
  const b: number[] = new Array<number>(n);
  for (let i: number = 0; i < n; i++) b[i] = pos2[nums1[i]];

  const tree: number[] = new Array<number>(n + 2).fill(0);
  function lowbit(x: number): number {
    return x & -x;
  }
  function update(i: number, d: number): void {
    for (; i <= n; i += lowbit(i)) tree[i] += d;
  }
  function query(i: number): number {
    let s: number = 0;
    for (; i > 0; i -= lowbit(i)) s += tree[i];
    return s;
  }

  // left[j]：j 左侧比 b[j] 小的元素个数（值域 [0,n-1]，BIT 下标为 value+1）
  const left: number[] = new Array<number>(n).fill(0);
  for (let j: number = 0; j < n; j++) {
    // 比 b[j] 小的值 => BIT 下标 <= b[j]
    left[j] = query(b[j]);
    update(b[j] + 1, 1);
  }

  // right[j]：j 右侧比 b[j] 大的元素个数
  tree.fill(0);
  const right: number[] = new Array<number>(n).fill(0);
  let seen: number = 0;
  for (let j: number = n - 1; j >= 0; j--) {
    // 已见总数 - 值 <= b[j] 的个数 = 值 > b[j] 的个数
    const le: number = query(b[j] + 1);
    right[j] = seen - le;
    update(b[j] + 1, 1);
    seen++;
  }

  let ans: number = 0;
  for (let j: number = 0; j < n; j++) ans += left[j] * right[j];
  return ans;
}

// 方法2：归并排序分治
// 同样转换为 b 数组后，用归并排序分别求出每个位置的
// leftSmaller（左侧严格更小个数）与 rightGreater（右侧严格更大个数），
// 再将二者相乘求和。时间复杂度 O(n log n)，空间复杂度 O(n)
function goodTripletsMerge(nums1: number[], nums2: number[]): number {
  const n: number = nums1.length;
  const pos2: number[] = new Array<number>(n).fill(0);
  for (let i: number = 0; i < n; i++) pos2[nums2[i]] = i;
  const b: number[] = new Array<number>(n);
  for (let i: number = 0; i < n; i++) b[i] = pos2[nums1[i]];

  // 计算 leftSmaller[j]：j 左侧比 b[j] 小的元素个数
  function countLeftSmaller(arr: number[]): number[] {
    const m: number = arr.length;
    const res: number[] = new Array<number>(m).fill(0);
    function mergeSort(a: [number, number][]): [number, number][] {
      if (a.length <= 1) return a;
      const mid: number = Math.floor(a.length / 2);
      const left: [number, number][] = mergeSort(a.slice(0, mid));
      const right: [number, number][] = mergeSort(a.slice(mid));
      const merged: [number, number][] = [];
      let i: number = 0;
      let j: number = 0;
      while (i < left.length && j < right.length) {
        // 升序；相等时先放右侧，保证只统计严格更小的左侧元素
        if (left[i][0] < right[j][0]) {
          merged.push(left[i++]);
        } else {
          res[right[j][1]] += i; // i = 已放置的左侧（严格更小）个数
          merged.push(right[j++]);
        }
      }
      while (i < left.length) merged.push(left[i++]);
      while (j < right.length) {
        res[right[j][1]] += i;
        merged.push(right[j++]);
      }
      return merged;
    }
    mergeSort(arr.map((v: number, idx: number): [number, number] => [v, idx]));
    return res;
  }

  // 计算 rightGreater[j]：j 右侧比 b[j] 大的元素个数
  function countRightGreater(arr: number[]): number[] {
    const m: number = arr.length;
    const res: number[] = new Array<number>(m).fill(0);
    function mergeSort(a: [number, number][]): [number, number][] {
      if (a.length <= 1) return a;
      const mid: number = Math.floor(a.length / 2);
      const left: [number, number][] = mergeSort(a.slice(0, mid));
      const right: [number, number][] = mergeSort(a.slice(mid));
      const merged: [number, number][] = [];
      let i: number = 0;
      let j: number = 0;
      while (i < left.length && j < right.length) {
        // 降序；相等时先放左侧，保证只统计严格更大的右侧元素
        if (left[i][0] >= right[j][0]) {
          res[left[i][1]] += j; // j = 已放置的右侧（严格更大）个数
          merged.push(left[i++]);
        } else {
          merged.push(right[j++]);
        }
      }
      while (i < left.length) {
        res[left[i][1]] += j;
        merged.push(left[i++]);
      }
      while (j < right.length) merged.push(right[j++]);
      return merged;
    }
    mergeSort(arr.map((v: number, idx: number): [number, number] => [v, idx]));
    return res;
  }

  const leftSmaller: number[] = countLeftSmaller(b);
  const rightGreater: number[] = countRightGreater(b);
  let ans: number = 0;
  for (let j: number = 0; j < n; j++) ans += leftSmaller[j] * rightGreater[j];
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 统计数组中好三元组数目 =====");
console.log(goodTriplets([2, 0, 1, 3], [0, 1, 2, 3])); // 期望结果: 1
console.log(goodTriplets([4, 0, 1, 3, 2], [4, 1, 0, 2, 3])); // 期望结果: 4
console.log("--- 方法2测试 ---");
console.log(goodTripletsMerge([2, 0, 1, 3], [0, 1, 2, 3])); // 期望结果: 1
console.log(goodTripletsMerge([4, 0, 1, 3, 2], [4, 1, 0, 2, 3])); // 期望结果: 4

export {};
