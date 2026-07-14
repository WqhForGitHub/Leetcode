// ============================================================
// 050. 删除所有值为某个元素后的最大子数组和
// ============================================================
// LeetCode（竞赛题）. Maximum Subarray Sum With Element Deletion
// 给定数组 nums，可以选择一个值 v 并删除数组中“所有”等于 v 的元素（也可以不删除任何元素），
// 然后求剩余数组的最大子数组和（子序列连续，非空）。在所有选择（包含“不删除”）中取最大值。
// 说明：删除 v 后剩余数组中原本被 v 隔开的非 v 元素变为相邻（即跨过 v 拼接）。
// 时间复杂度：O(n * d) 或 O(n log n), 空间复杂度：O(n)（d 为不同值的个数）

const NINF_SUB: number = Number.NEGATIVE_INFINITY;

// 标准 Kadane（非空子数组最大和）
function kadane(arr: number[]): number {
  let best: number = NINF_SUB;
  let cur: number = NINF_SUB;
  for (const x of arr) {
    cur = Math.max(x, cur + x);
    best = Math.max(best, cur);
  }
  return best;
}

// 跳过值 v 的 Kadane：等价于把所有 v 删除后剩余数组的最大子数组和（非空）
function skipKadane(arr: number[], v: number): number {
  let best: number = NINF_SUB;
  let cur: number = NINF_SUB;
  for (const x of arr) {
    if (x === v) continue; // v 被删除，不打破连续性，cur 跨过 v 继续
    cur = Math.max(x, cur + x);
    best = Math.max(best, cur);
  }
  return best; // 若无非 v 元素则返回 -∞
}

// 方法1：枚举每个不同值 v 做 skipKadane（推荐）
// 对每个不同值 v 计算“删除所有 v 后”的最大子数组和，并与“不删除”（原 Kadane）取最大。
// 时间复杂度 O(n * d)，d 为不同值个数；空间复杂度 O(d)
function maxSubarraySumWithElementDeletion(nums: number[]): number {
  const distinct: number[] = [...new Set<number>(nums)];
  let ans: number = kadane(nums); // 不删除任何元素
  for (const v of distinct) {
    const cur: number = skipKadane(nums, v);
    if (cur > ans) ans = cur;
  }
  return ans;
}

// 方法2：线段树维护 Kadane 四元组，按值聚合非 v 段
// 线段树每个节点维护 (total, maxPref, maxSuff, maxSub)。
// 对值 v，其出现位置将数组切成若干非 v 段；将这些段的四元组按顺序合并，
// 合并结果即“删除 v 后数组”的四元组，其 maxSub 即 skipKadane(v)。
// 所有段数之和为 O(n)，故总时间 O(n log n)，空间 O(n)。
function maxSubarraySumWithElementDeletionST(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  // tree[node] = [total, maxPref, maxSuff, maxSub]
  const tree: number[][] = new Array<number[]>(4 * n)
    .fill([])
    .map((): number[] => [0, NINF_SUB, NINF_SUB, NINF_SUB]);

  function combine(L: number[], R: number[]): number[] {
    return [
      L[0] + R[0],
      Math.max(L[1], L[0] + R[1]),
      Math.max(R[2], R[0] + L[2]),
      Math.max(L[3], R[3], L[2] + R[1]),
    ];
  }
  function build(node: number, l: number, r: number): void {
    if (l === r) {
      tree[node] = [nums[l], nums[l], nums[l], nums[l]];
      return;
    }
    const mid: number = (l + r) >> 1;
    build(node * 2, l, mid);
    build(node * 2 + 1, mid + 1, r);
    tree[node] = combine(tree[node * 2], tree[node * 2 + 1]);
  }
  function query(node: number, l: number, r: number, ql: number, qr: number): number[] {
    if (qr < l || r < ql) return [0, NINF_SUB, NINF_SUB, NINF_SUB]; // 单位元
    if (ql <= l && r <= qr) return tree[node];
    const mid: number = (l + r) >> 1;
    return combine(query(node * 2, l, mid, ql, qr), query(node * 2 + 1, mid + 1, r, ql, qr));
  }
  build(1, 0, n - 1);

  // 按值收集出现位置
  const posMap: Map<number, number[]> = new Map<number, number[]>();
  nums.forEach((v: number, i: number): void => {
    const list: number[] | undefined = posMap.get(v);
    if (list) list.push(i);
    else posMap.set(v, [i]);
  });

  let ans: number = tree[1][3]; // 不删除任何元素时的 Kadane
  for (const plist of posMap.values()) {
    let acc: number[] = [0, NINF_SUB, NINF_SUB, NINF_SUB]; // 单位元
    let prev: number = -1;
    for (const p of plist) {
      if (p - 1 >= prev + 1) acc = combine(acc, query(1, 0, n - 1, prev + 1, p - 1));
      prev = p;
    }
    if (n - 1 >= prev + 1) acc = combine(acc, query(1, 0, n - 1, prev + 1, n - 1));
    if (acc[3] > ans) ans = acc[3]; // acc[3] = skipKadane(v)；无非 v 元素时为 -∞
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 删除所有值为某个元素后的最大子数组和 =====");
console.log(maxSubarraySumWithElementDeletion([1, -5, 2])); // 期望结果: 3 (删除 -5，得 1+2)
console.log(maxSubarraySumWithElementDeletion([5, -1, 5])); // 期望结果: 10 (删除 -1，得 5+5)
console.log(maxSubarraySumWithElementDeletion([1, 2, 3])); // 期望结果: 6 (不删除最优)
console.log(maxSubarraySumWithElementDeletion([-1, -2, -3])); // 期望结果: -1 (最大单元素)
console.log("--- 方法2测试 ---");
console.log(maxSubarraySumWithElementDeletionST([1, -5, 2])); // 期望结果: 3
console.log(maxSubarraySumWithElementDeletionST([5, -1, 5])); // 期望结果: 10
console.log(maxSubarraySumWithElementDeletionST([1, 2, 3])); // 期望结果: 6
console.log(maxSubarraySumWithElementDeletionST([-1, -2, -3])); // 期望结果: -1

export {};
