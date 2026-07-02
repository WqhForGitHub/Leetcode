// ============================================================
// 058. 最长平衡子数组 II
// ============================================================
// LeetCode（竞赛题）. Longest Balanced Subarray II
// 给定一个整数数组 nums，找出最长的连续子数组，使得在“子数组自身的 0 下标”下，
// 偶数下标元素之和等于奇数下标元素之和。例如 [a,b,c,d] 满足 a+c == b+d。
// 时间复杂度：O(n), 空间复杂度：O(n)

// 关键推导：
// 令 P[0]=0，P[i] = P[i-1] + ((i-1) 为偶 ? nums[i-1] : -nums[i-1])，即交替符号前缀和：
//   P[k] = nums[0] - nums[1] + nums[2] - nums[3] + ... （第 k 项符号为 (-1)^(k-1)）。
// 子数组 nums[l..r] 中“偶数下标和 - 奇数下标和”（按下标 l 起算的相对偶/奇）等于
//   P[r+1] - P[l] 乘以一个由 l 奇偶性决定的符号 ±1；但等于 0 的条件与该符号无关，
//   故平衡当且仅当 P[r+1] == P[l]，与 l 的奇偶性无关。
// 于是问题转化为：求最大的 j-i（0<=i<j<=n）满足 P[i]==P[j]。

// 方法1：交替符号前缀和 + 哈希表（推荐）
// 用哈希表记录每个前缀和值首次出现的下标，再次遇到相同值时用下标差更新答案。
// 时间复杂度 O(n)，空间复杂度 O(n)
function longestBalancedSubarrayII(nums: number[]): number {
  const n: number = nums.length;
  const first: Map<number, number> = new Map<number, number>();
  first.set(0, -1); // P[-1] = 0，对应“空前缀”下标 -1
  let prefix: number = 0;
  let ans: number = 0;
  // 这里 i 对应原数组下标；prefix 在处理 nums[i] 后等于 P[i+1]
  for (let i: number = 0; i < n; i++) {
    prefix += i % 2 === 0 ? nums[i] : -nums[i];
    const prev: number | undefined = first.get(prefix);
    if (prev !== undefined) {
      const len: number = i - prev; // 子数组长度 = (i) - (prev) = (r+1) - l
      if (len > ans) ans = len;
    } else {
      first.set(prefix, i);
    }
  }
  return ans;
}

// 方法2：归并排序分治求前缀和相等点对的最大距离 O(n log n)
// 将 P[0..n] 视为长度 n+1 的数组，求 max(j-i) 满足 i<j 且 P[i]==P[j]。
// 分治：答案取“左半内部”“右半内部”“跨越分界线”三者最大。
// 跨越情况：对每个在两侧都出现的值 v，用“左半最小下标”与“右半最大下标”相减。
// 归并过程中两半均按 (P 值升序, 下标升序) 排序，双指针即可在 O(段长) 内统计跨越配对。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function longestBalancedSubarrayIIDC(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  // 构造前缀和数组 P[0..n]
  const P: number[] = new Array<number>(n + 1);
  P[0] = 0;
  for (let i: number = 1; i <= n; i++) {
    P[i] = P[i - 1] + ((i - 1) % 2 === 0 ? nums[i - 1] : -nums[i - 1]);
  }
  // idx 维护当前区间按 (P 值, 下标) 排序后的下标序列，归并原地写回
  const idx: number[] = P.map((_: number, i: number): number => i);
  let best: number = 0;

  function mergeSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid: number = (lo + hi) >> 1;
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);

    const leftSorted: number[] = idx.slice(lo, mid + 1);
    const rightSorted: number[] = idx.slice(mid + 1, hi + 1);
    const L: number = leftSorted.length;
    const R: number = rightSorted.length;

    // 统计跨越配对：对相同 P 值，左半取最小下标、右半取最大下标
    let p: number = 0;
    let q: number = 0;
    while (p < L && q < R) {
      const lv: number = P[leftSorted[p]];
      const rv: number = P[rightSorted[q]];
      if (lv < rv) {
        p++;
      } else if (lv > rv) {
        q++;
      } else {
        const v: number = lv;
        const minLeft: number = leftSorted[p]; // 左半该值的首个（下标最小）
        while (p < L && P[leftSorted[p]] === v) p++;
        let maxRight: number = rightSorted[q]; // 右半该值的最后一个（下标最大）
        while (q < R && P[rightSorted[q]] === v) {
          maxRight = rightSorted[q];
          q++;
        }
        const cand: number = maxRight - minLeft;
        if (cand > best) best = cand;
      }
    }

    // 按 (P 值, 下标) 合并两段写回 idx[lo..hi]
    let i: number = lo;
    let a: number = 0;
    let b: number = 0;
    while (a < L && b < R) {
      const take: boolean =
        P[leftSorted[a]] < P[rightSorted[b]] ||
        (P[leftSorted[a]] === P[rightSorted[b]] && leftSorted[a] <= rightSorted[b]);
      idx[i++] = take ? leftSorted[a++] : rightSorted[b++];
    }
    while (a < L) idx[i++] = leftSorted[a++];
    while (b < R) idx[i++] = rightSorted[b++];
  }

  mergeSort(0, n);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 最长平衡子数组 II =====");
console.log(longestBalancedSubarrayII([1, 2, 1, 2])); // 期望结果: 3 ([1,2,1]: 1+1==2)
console.log(longestBalancedSubarrayII([1, 1, 1, 1])); // 期望结果: 4 (1+1==1+1)
console.log(longestBalancedSubarrayII([1, 2, 3, 4])); // 期望结果: 0 (无平衡子数组)
console.log(longestBalancedSubarrayII([0])); // 期望结果: 1 (偶和 0 == 奇和 0)
console.log(longestBalancedSubarrayII([1])); // 期望结果: 0
console.log(longestBalancedSubarrayII([3, 3, 3, 3])); // 期望结果: 4
console.log(longestBalancedSubarrayII([2, 2, 2, 2, 2, 2])); // 期望结果: 6
console.log(longestBalancedSubarrayII([1, 2, 3, 4, 5, 6])); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(longestBalancedSubarrayIIDC([1, 2, 1, 2])); // 期望结果: 3
console.log(longestBalancedSubarrayIIDC([1, 1, 1, 1])); // 期望结果: 4
console.log(longestBalancedSubarrayIIDC([1, 2, 3, 4])); // 期望结果: 0
console.log(longestBalancedSubarrayIIDC([0])); // 期望结果: 1
console.log(longestBalancedSubarrayIIDC([1])); // 期望结果: 0
console.log(longestBalancedSubarrayIIDC([3, 3, 3, 3])); // 期望结果: 4
console.log(longestBalancedSubarrayIIDC([2, 2, 2, 2, 2, 2])); // 期望结果: 6
console.log(longestBalancedSubarrayIIDC([1, 2, 3, 4, 5, 6])); // 期望结果: 0

export {};
