// ============================================================
// 051. 逆序对计数的最小阈值
// ============================================================
// LeetCode 3531. Minimum Threshold for Inversion Count
// 给定整数数组 nums 和整数 k，寻找阈值 x，使得满足
// 0 <= i < j < n 且 nums[i] - nums[j] >= x 的数对 (i, j) 数量至少为 k。
// 若数对总数不足 k，返回 -1。
// 注意：count(x) 随 x 单调不增，所求即为满足 count(x) >= k 的最大 x，
// 也就是所有数对差值 nums[i]-nums[j] 中第 k 大的差值。
// 时间复杂度：O(n log n log C), 空间复杂度：O(n)

// 方法1：二分答案 + 归并排序分治计数（推荐）
// 对阈值 x 二分；每次 check 用归并排序，在合并阶段统计
// 交叉数对中满足 nums[i]-nums[j] >= x（即 arr[j] <= arr[i]-x）的个数。
function minThreshold1(nums: number[], k: number): number {
  const n: number = nums.length;
  const total: number = (n * (n - 1)) >> 1;
  if (k > total) return -1; // 数对总数不足 k，不可能

  // 统计数对 (i<j) 满足 nums[i]-nums[j] >= x
  const countGE = (x: number): number => {
    const arr: number[] = nums.slice();
    const temp: number[] = new Array(n);
    const mergeCount = (l: number, r: number): number => {
      if (l >= r) return 0;
      const m: number = (l + r) >> 1;
      let cnt: number = mergeCount(l, m) + mergeCount(m + 1, r);
      // 统计交叉对：i in [l,m], j in [m+1,r], arr[i]-arr[j] >= x
      // 两段均已升序，用双指针：对每个 i 找右段中 arr[j] <= arr[i]-x 的个数
      let j: number = m + 1;
      for (let i: number = l; i <= m; i++) {
        while (j <= r && arr[j] <= arr[i] - x) j++;
        cnt += j - (m + 1);
      }
      // 归并两段（升序）
      let p: number = l,
        q: number = m + 1,
        t: number = l;
      while (p <= m && q <= r) {
        if (arr[p] <= arr[q]) temp[t++] = arr[p++];
        else temp[t++] = arr[q++];
      }
      while (p <= m) temp[t++] = arr[p++];
      while (q <= r) temp[t++] = arr[q++];
      for (let s: number = l; s <= r; s++) arr[s] = temp[s];
      return cnt;
    };
    return mergeCount(0, n - 1);
  };

  // 二分：寻找满足 countGE(x) >= k 的最大 x
  let minV: number = nums[0],
    maxV: number = nums[0];
  for (let i: number = 1; i < n; i++) {
    if (nums[i] < minV) minV = nums[i];
    if (nums[i] > maxV) maxV = nums[i];
  }
  let lo: number = minV - maxV; // 最小可能差值，count = total
  let hi: number = maxV - minV; // 最大可能差值
  while (lo < hi) {
    const mid: number = (lo + hi + 1) >> 1; // 向上取整避免死循环
    if (countGE(mid) >= k) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// 方法2：二分答案 + 排序离散化 + 树状数组计数
// 对每个阈值 x，从左到右扫描数组，用树状数组维护已出现值；
// 对每个 j 二分定位秩，统计其左侧 nums[i] >= nums[j]+x 的个数。
function minThreshold2(nums: number[], k: number): number {
  const n: number = nums.length;
  const total: number = (n * (n - 1)) >> 1;
  if (k > total) return -1;

  // 离散化：对所有出现过的值排序去重，建立值到秩的映射
  const sorted: number[] = [...new Set(nums)].sort((a: number, b: number): number => a - b);
  const m: number = sorted.length;
  const rank: Map<number, number> = new Map();
  for (let i: number = 0; i < m; i++) rank.set(sorted[i], i + 1);

  const countGE = (x: number): number => {
    const tree: number[] = new Array(m + 1).fill(0);
    const add = (i: number): void => {
      while (i <= m) {
        tree[i]++;
        i += i & -i;
      }
    };
    const query = (i: number): number => {
      let s: number = 0;
      while (i > 0) {
        s += tree[i];
        i -= i & -i;
      }
      return s;
    };
    let cnt: number = 0;
    let seen: number = 0; // 已插入元素总数
    for (let j: number = 0; j < n; j++) {
      // 统计左侧 nums[i] >= nums[j]+x 的个数 = seen - (秩 < target秩 的个数)
      const target: number = nums[j] + x;
      // 二分找 sorted 中第一个 >= target 的下标 idx
      let loB: number = 0,
        hiB: number = m;
      while (loB < hiB) {
        const mid: number = (loB + hiB) >> 1;
        if (sorted[mid] >= target) hiB = mid;
        else loB = mid + 1;
      }
      // 秩 >= loB+1 的元素均 >= target，个数为 seen - query(loB)
      cnt += seen - query(loB);
      add(rank.get(nums[j]) as number);
      seen++;
    }
    return cnt;
  };

  let minV: number = nums[0],
    maxV: number = nums[0];
  for (let i: number = 1; i < n; i++) {
    if (nums[i] < minV) minV = nums[i];
    if (nums[i] > maxV) maxV = nums[i];
  }
  let lo: number = minV - maxV;
  let hi: number = maxV - minV;
  while (lo < hi) {
    const mid: number = (lo + hi + 1) >> 1;
    if (countGE(mid) >= k) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 逆序对计数的最小阈值 =====");
console.log("方法1 [3,1,2], k=2:", minThreshold1([3, 1, 2], 2)); // 期望结果: 1
console.log("方法2 [3,1,2], k=2:", minThreshold2([3, 1, 2], 2)); // 期望结果: 1
console.log("方法1 [3,1,2], k=1:", minThreshold1([3, 1, 2], 1)); // 期望结果: 2
console.log("方法2 [3,1,2], k=1:", minThreshold2([3, 1, 2], 1)); // 期望结果: 2
console.log("方法1 [3,1,2], k=4:", minThreshold1([3, 1, 2], 4)); // 期望结果: -1
console.log("方法2 [3,1,2], k=4:", minThreshold2([3, 1, 2], 4)); // 期望结果: -1
console.log("方法1 [4,3,2,1], k=2:", minThreshold1([4, 3, 2, 1], 2)); // 期望结果: 2
console.log("方法2 [4,3,2,1], k=2:", minThreshold2([4, 3, 2, 1], 2)); // 期望结果: 2
console.log("方法1 [1,4], k=1:", minThreshold1([1, 4], 1)); // 期望结果: -3
console.log("方法2 [1,4], k=1:", minThreshold2([1, 4], 1)); // 期望结果: -3

export {};
