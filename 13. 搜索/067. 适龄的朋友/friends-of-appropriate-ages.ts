// ============================================================
// 067. 适龄的朋友
// ============================================================
// LeetCode 825. Friends Of Appropriate Ages
// 统计用户发送的好友请求数（A 向 B 发请求需满足条件）。

// 方法1：排序 + 二分查找
function numFriendRequests(ages: number[]): number {
  ages.sort((a, b) => a - b);
  let count = 0;
  for (const age of ages) {
    // 条件1: ageB > 0.5*age + 7（即 ageB >= age*0.5+8）
    const minAge = Math.floor(age * 0.5) + 8;
    // 条件2: ageB <= age
    // 找年龄在 [minAge, age] 范围内的用户数
    const leftIdx = lowerBound(ages, minAge);
    const rightIdx = upperBound(ages, age) - 1;
    const num = rightIdx - leftIdx + 1;
    if (num > 0) count += num - 1; // 减去自己
  }
  return count;
}

function lowerBound(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// 方法2：计数排序
function numFriendRequestsCount(ages: number[]): number {
  const count = new Array(121).fill(0);
  for (const age of ages) count[age]++;
  let result = 0;
  for (let ageA = 1; ageA <= 120; ageA++) {
    for (let ageB = 1; ageB <= 120; ageB++) {
      if (ageB <= 0.5 * ageA + 7) continue;
      if (ageB > ageA) continue;
      if (ageB > 100 && ageA < 100) continue;
      result += count[ageA] * (count[ageB] - (ageA === ageB ? 1 : 0));
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 适龄的朋友 =====");
console.log("二分 [16,16]:", numFriendRequests([16, 16])); // 2
console.log("二分 [16,17,18]:", numFriendRequests([16, 17, 18])); // 2
console.log("二分 [20,30,100,110,120]:", numFriendRequests([20, 30, 100, 110, 120])); // 3
console.log("计数 [16,16]:", numFriendRequestsCount([16, 16])); // 2

export {};
