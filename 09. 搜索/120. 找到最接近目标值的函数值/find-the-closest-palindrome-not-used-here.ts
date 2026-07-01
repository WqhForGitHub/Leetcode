// ============================================================
// 120. 找到最接近目标值的函数值
// ============================================================
// LeetCode 1520. Maximum Number of Non-Overlapping Substrings
// （本题按标题实现：找到数组/函数中最接近目标值的值）

// 方法1：二分查找最接近值
function closestToTarget(arr: number[], target: number): number {
  let result = Infinity;
  // 对所有子数组的按位与结果找最接近 target 的
  const allAnds = new Set<number>();
  for (let i = 0; i < arr.length; i++) {
    let cur = arr[i];
    allAnds.add(cur);
    for (let j = i - 1; j >= 0; j--) {
      cur &= arr[j];
      allAnds.add(cur);
      if (cur === 0) break; // AND 只会变小，到 0 不用继续
    }
  }
  for (const val of allAnds) {
    result = Math.min(result, Math.abs(val - target));
  }
  return result;
}

// 方法2：滑动窗口 + 集合（优化）
function closestToTargetOpt(arr: number[], target: number): number {
  let result = Infinity;
  let ands = new Set<number>();
  for (const num of arr) {
    const newAnds = new Set<number>([num]);
    for (const val of ands) {
      newAnds.add(val & num);
    }
    ands = newAnds;
    for (const val of ands) {
      result = Math.min(result, Math.abs(val - target));
      if (result === 0) return 0;
    }
  }
  return result;
}

// 方法3：二分查找（如果数组有序）
function closestToTargetBinary(arr: number[], target: number): number {
  arr.sort((a, b) => a - b);
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  let result = Math.abs(arr[lo] - target);
  if (lo > 0) {
    result = Math.min(result, Math.abs(arr[lo - 1] - target));
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 120. 找到最接近目标值的函数值 =====");
console.log("集合 [9,12,3,7,15],5:", closestToTarget([9, 12, 3, 7, 15], 5)); // 2
console.log("集合 [1,2,3],7:", closestToTarget([1, 2, 3], 7)); // 4
console.log("优化 [9,12,3,7,15],5:", closestToTargetOpt([9, 12, 3, 7, 15], 5)); // 2

export {};
