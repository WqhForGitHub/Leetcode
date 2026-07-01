// ============================================================
// 050. 供暖器
// ============================================================
// LeetCode 475. Heaters
// 给定房屋位置和供暖器位置，求最小供暖半径，使所有房屋都被覆盖。

// 方法1：排序 + 双指针（推荐，O(n log n + m log m) 时间）
// 将房屋和供暖器都排序，用指针 j 跟踪距离当前房屋最近的供暖器。
// 对每个房屋，若下一个供暖器更近则前进 j，取最小距离的最大值。
function findRadius(houses: number[], heaters: number[]): number {
  houses.sort((a, b) => a - b);
  heaters.sort((a, b) => a - b);
  let radius = 0;
  let j = 0;
  for (const house of houses) {
    // 当下一个供暖器离 house 更近（或一样近）时，前进到下一个
    while (
      j < heaters.length - 1 &&
      Math.abs(heaters[j + 1] - house) <= Math.abs(heaters[j] - house)
    ) {
      j++;
    }
    radius = Math.max(radius, Math.abs(heaters[j] - house));
  }
  return radius;
}

// 方法2：排序 + 二分查找（O(n log m + m log m) 时间）
// 供暖器排序后，对每个房屋二分找到第一个 >= house 的供暖器，
// 比较 it 和前一个供暖器，取较近者。
function findRadiusBinarySearch(houses: number[], heaters: number[]): number {
  heaters.sort((a, b) => a - b);
  let radius = 0;
  for (const house of houses) {
    // 二分找第一个 >= house 的供暖器下标
    let lo = 0;
    let hi = heaters.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (heaters[mid] < house) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    // lo 为第一个 >= house 的供暖器；lo-1 为最后一个 < house 的供暖器
    let dist = Infinity;
    if (lo < heaters.length) dist = Math.min(dist, heaters[lo] - house);
    if (lo > 0) dist = Math.min(dist, house - heaters[lo - 1]);
    radius = Math.max(radius, dist);
  }
  return radius;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 供暖器 =====");
console.log("双指针 [1,2,3] & [2]:", findRadius([1, 2, 3], [2])); // 期望 1
console.log("双指针 [1,2,3,4] & [1,4]:", findRadius([1, 2, 3, 4], [1, 4])); // 期望 1
console.log("双指针 [1,5] & [2]:", findRadius([1, 5], [2])); // 期望 3
console.log("二分 [1,2,3] & [2]:", findRadiusBinarySearch([1, 2, 3], [2])); // 期望 1
console.log("二分 [1,2,3,4] & [1,4]:", findRadiusBinarySearch([1, 2, 3, 4], [1, 4])); // 期望 1
console.log("二分 [1,5] & [2]:", findRadiusBinarySearch([1, 5], [2])); // 期望 3

export {};
