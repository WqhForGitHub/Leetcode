// ============================================================
// 019. 第一个错误的版本
// ============================================================
// LeetCode 278. First Bad Version
// 产品有 n 个版本，从某个版本开始所有版本都有缺陷。
// 给定 isBadVersion(version) 接口，找出第一个坏版本。

// 模拟 API
let badVersion = 4;
function isBadVersion(version: number): boolean {
  return version >= badVersion;
}

// 方法1：二分查找（左边界）
function firstBadVersion(n: number): number {
  let left = 1;
  let right = n;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// 方法2：二分查找（闭区间写法）
function firstBadVersionClosed(n: number): number {
  let left = 1;
  let right = n;
  let result = n;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (isBadVersion(mid)) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 第一个错误的版本 =====");
badVersion = 4;
console.log("二分 5:", firstBadVersion(5)); // 4
console.log("闭区间 5:", firstBadVersionClosed(5)); // 4
badVersion = 1;
console.log("二分 1:", firstBadVersion(1)); // 1

export {};
