// ============================================================
// 45. 种花问题
// ============================================================
// LeetCode 605. Can Place Flowers
// 给定花坛数组 flowerbed（0表示空，1表示已种花）和 n，判断能否种 n 朵花（相邻不能种花）。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：贪心-遍历检查相邻位置（推荐）
function canPlaceFlowers(flowerbed: number[], n: number): boolean {
  let count = 0;
  for (let i = 0; i < flowerbed.length; i++) {
    // 当前位置为空，且左右相邻位置也为空（边界外视为空），则可以种花
    if (flowerbed[i] === 0) {
      const leftEmpty = i === 0 || flowerbed[i - 1] === 0;
      const rightEmpty = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;
      if (leftEmpty && rightEmpty) {
        flowerbed[i] = 1; // 种下花
        count++;
        // 提前剪枝：已经够数则直接返回
        if (count >= n) {
          return true;
        }
      }
    }
  }
  return count >= n;
}

// 方法2：跳过已种花位置的优化贪心
function canPlaceFlowersSkip(flowerbed: number[], n: number): boolean {
  let count = 0;
  let i = 0;
  while (i < flowerbed.length) {
    if (
      flowerbed[i] === 0 &&
      (i === 0 || flowerbed[i - 1] === 0) &&
      (i === flowerbed.length - 1 || flowerbed[i + 1] === 0)
    ) {
      flowerbed[i] = 1;
      count++;
      // 种花后下一个位置必然不能种，直接跳过
      i += 2;
    } else if (flowerbed[i] === 1) {
      // 当前已种花，跳两步（因为下一格必然不能种）
      i += 2;
    } else {
      // 当前位置不能种花（左右有花），前进一步
      i++;
    }
  }
  return count >= n;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 45. 种花问题 =====");
console.log("贪心:", canPlaceFlowers([1, 0, 0, 0, 1], 1)); // 期望结果: true
console.log("贪心:", canPlaceFlowers([1, 0, 0, 0, 1], 2)); // 期望结果: false
console.log("贪心:", canPlaceFlowers([1, 0, 0, 0, 0, 1], 2)); // 期望结果: false
console.log("贪心:", canPlaceFlowers([0, 0, 1, 0, 1], 1)); // 期望结果: true
console.log("跳过:", canPlaceFlowersSkip([1, 0, 0, 0, 1].slice(), 1)); // 期望结果: true
console.log("跳过:", canPlaceFlowersSkip([1, 0, 0, 0, 1].slice(), 2)); // 期望结果: false

export {};
