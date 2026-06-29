// ============================================================
// 124. 数位和相等数对的最大和
// ============================================================
// LeetCode 2342. Max Sum of a Pair With Equal Sum of Digits
// 找两个数位和相同的数，使它们的和最大。
// 时间复杂度：O(n log m)，空间复杂度：O(n)

// 方法1：哈希表 + 最大值跟踪
function maximumSum(nums: number[]): number {
  const digitSum = (n: number): number => {
    let s = 0;
    while (n > 0) { s += n % 10; n = Math.floor(n / 10); }
    return s;
  };
  const map: Map<number, number> = new Map(); // digitSum -> max value
  let result = -1;
  for (const num of nums) {
    const ds = digitSum(num);
    if (map.has(ds)) {
      result = Math.max(result, map.get(ds)! + num);
      map.set(ds, Math.max(map.get(ds)!, num));
    } else {
      map.set(ds, num);
    }
  }
  return result;
}

// 方法2：哈希表 + 最大堆（每个数位和维护两个最大值）
function maximumSumHeap(nums: number[]): number {
  const digitSum = (n: number): number => {
    let s = 0;
    while (n > 0) { s += n % 10; n = Math.floor(n / 10); }
    return s;
  };
  const groups: Map<number, number[]> = new Map();
  for (const num of nums) {
    const ds = digitSum(num);
    if (!groups.has(ds)) groups.set(ds, []);
    groups.get(ds)!.push(num);
  }
  let result = -1;
  for (const arr of groups.values()) {
    if (arr.length < 2) continue;
    arr.sort((a, b) => b - a);
    result = Math.max(result, arr[0] + arr[1]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 124. 数位和相等数对的最大和 =====");
console.log("哈希表:", maximumSum([18, 43, 36, 13, 7])); // 期望 54
console.log("堆:", maximumSumHeap([10, 12, 19, 14])); // 期望 -1

export {};
