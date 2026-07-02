// ============================================================
// 039. 供暖器
// ============================================================
// LeetCode 475. Heaters
// 房屋和供暖器在一条线上，找到能覆盖所有房屋的最小供暖半径。

// 方法1：排序 + 二分查找最近供暖器
function findRadius(houses: number[], heaters: number[]): number {
  heaters.sort((a, b) => a - b);
  let radius = 0;
  for (const house of houses) {
    const dist = findNearestHeater(heaters, house);
    radius = Math.max(radius, dist);
  }
  return radius;
}

function findNearestHeater(heaters: number[], house: number): number {
  let left = 0;
  let right = heaters.length - 1;
  // 二分找最近的供暖器
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (heaters[mid] < house) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  // 比较 left 和 left-1
  let dist = Math.abs(heaters[left] - house);
  if (left > 0) {
    dist = Math.min(dist, Math.abs(heaters[left - 1] - house));
  }
  return dist;
}

// 方法2：排序 + 双指针
function findRadiusTwoPointer(houses: number[], heaters: number[]): number {
  houses.sort((a, b) => a - b);
  heaters.sort((a, b) => a - b);
  let radius = 0;
  let j = 0;
  for (const house of houses) {
    // 找到最近的供暖器
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

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 供暖器 =====");
console.log("二分 [1,2,3],[2]:", findRadius([1, 2, 3], [2])); // 1
console.log("二分 [1,2,3,4],[1,4]:", findRadius([1, 2, 3, 4], [1, 4])); // 1
console.log("双指针 [1,5],[2]:", findRadiusTwoPointer([1, 5], [2])); // 3

export {};
