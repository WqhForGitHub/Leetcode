// ============================================================
// 222. 最接近目标值的子序列和
// ============================================================
// LeetCode 1755. Closest Subsequence Sum
// 给定整数数组 nums（长度最多 40）和目标值 goal，
// 求任意子序列的和与 goal 的最小绝对差。

// 方法1：折半查找 + 一半排序 + 二分查找（O(2^(n/2) log 2^(n/2))）
// 将数组分成左右两半，分别枚举所有子集和。
// 遍历左半每个和 s，在右半排序后的和中二分找最接近 goal-s 的值。
function minAbsDifference1(nums: number[], goal: number): number {
  const n = nums.length;
  const half = n >> 1;
  const left = nums.slice(0, half);
  const right = nums.slice(half);

  const getSubsets = (arr: number[]): number[] => {
    const res: number[] = [0];
    for (const x of arr) {
      const sz = res.length;
      for (let i = 0; i < sz; i++) res.push(res[i] + x);
    }
    return res;
  };

  const leftSums = getSubsets(left);
  const rightSums = getSubsets(right).sort((a, b) => a - b);

  let best = Infinity;
  for (const s of leftSums) {
    const target = goal - s;
    let lo = 0;
    let hi = rightSums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (rightSums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    if (lo < rightSums.length) {
      const d = Math.abs(s + rightSums[lo] - goal);
      if (d < best) best = d;
    }
    if (lo > 0) {
      const d = Math.abs(s + rightSums[lo - 1] - goal);
      if (d < best) best = d;
    }
    if (best === 0) return 0;
  }
  return best;
}

// 方法2：折半查找 + 两半排序 + 双指针（O(2^(n/2) log 2^(n/2))）
// 两半子集和都排序后，左指针从头开始，右指针从尾开始，
// 根据 sum 与 goal 的大小关系移动指针，逐步逼近 goal。
function minAbsDifference2(nums: number[], goal: number): number {
  const n = nums.length;
  const half = n >> 1;
  const left = nums.slice(0, half);
  const right = nums.slice(half);

  const getSubsets = (arr: number[]): number[] => {
    const res: number[] = [0];
    for (const x of arr) {
      const sz = res.length;
      for (let i = 0; i < sz; i++) res.push(res[i] + x);
    }
    return res;
  };

  const leftSums = getSubsets(left).sort((a, b) => a - b);
  const rightSums = getSubsets(right).sort((a, b) => a - b);

  let best = Infinity;
  let i = 0;
  let j = rightSums.length - 1;
  while (i < leftSums.length && j >= 0) {
    const sum = leftSums[i] + rightSums[j];
    const d = Math.abs(sum - goal);
    if (d < best) best = d;
    if (best === 0) return 0;
    if (sum < goal) i++;
    else if (sum > goal) j--;
    else return 0;
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 222. 最接近目标值的子序列和 =====");
console.log("方法1 [5,-7,3,5] goal=6:", minAbsDifference1([5, -7, 3, 5], 6)); // 0
console.log("方法2 [5,-7,3,5] goal=6:", minAbsDifference2([5, -7, 3, 5], 6)); // 0
console.log("方法1 [7,-9,15,-2] goal=-5:", minAbsDifference1([7, -9, 15, -2], -5)); // 1
console.log("方法2 [7,-9,15,-2] goal=-5:", minAbsDifference2([7, -9, 15, -2], -5)); // 1
console.log("方法1 [1,2,3] goal=-5:", minAbsDifference1([1, 2, 3], -5)); // 5
console.log("方法2 [1,2,3] goal=-5:", minAbsDifference2([1, 2, 3], -5)); // 5

export {};
