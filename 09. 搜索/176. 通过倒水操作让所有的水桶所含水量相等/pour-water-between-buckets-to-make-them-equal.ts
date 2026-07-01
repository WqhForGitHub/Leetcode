// ============================================================
// 176. 通过倒水操作让所有的水桶所含水量相等
// ============================================================
// LeetCode 2137. Pour Water Between Buckets to Make Them Equal
// 有 n 个水桶，buckets[i] 为水量。可以在任意两桶间倒水，
// 倒水过程中损失 loss% 的水。判断能否使所有水桶水量相等（>0）。
// 二分查找：对目标水位 target，检查可转移盈余是否 >= 亏损。

// 方法1：二分查找（浮点数二分）
function equalizeWater(buckets: number[], loss: number): boolean {
  const n = buckets.length;
  const efficiency = (100 - loss) / 100; // 倒水效率

  function canAchieve(target: number): boolean {
    let surplus = 0;
    let deficit = 0;
    for (const b of buckets) {
      if (b > target) {
        surplus += (b - target) * efficiency;
      } else {
        deficit += target - b;
      }
    }
    return surplus >= deficit - 1e-5;
  }

  let left = 0;
  let right = Math.max(...buckets);
  const eps = 1e-5;

  while (right - left > eps) {
    const mid = (left + right) / 2;
    if (canAchieve(mid)) {
      left = mid;
    } else {
      right = mid;
    }
  }
  // 判断是否能达到正水位
  return left > eps && canAchieve(left);
}

// 方法2：数学推导判断
// 当 loss = 0 时，平均水位 sum/n 即可
// 当 loss > 0 时，最大可达水位需要考虑损失
function equalizeWaterMath(buckets: number[], loss: number): boolean {
  if (loss === 0) return true; // 无损失时总能平均
  const n = buckets.length;
  const efficiency = (100 - loss) / 100;
  const total = buckets.reduce((a, b) => a + b, 0);
  // 最大可达水位：所有高于水位的水桶贡献盈余
  // 二分查找最大可达水位
  let left = 0;
  let right = Math.max(...buckets);
  const eps = 1e-5;
  while (right - left > eps) {
    const mid = (left + right) / 2;
    let surplus = 0;
    let deficit = 0;
    for (const b of buckets) {
      if (b > mid) surplus += (b - mid) * efficiency;
      else deficit += mid - b;
    }
    if (surplus >= deficit) {
      left = mid;
    } else {
      right = mid;
    }
  }
  return left > eps;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 176. 通过倒水操作让所有的水桶所含水量相等 =====");
console.log("二分 [1,2,7],80:", equalizeWater([1, 2, 7], 80)); // false
console.log("二分 [2,4,6],0:", equalizeWater([2, 4, 6], 0)); // true
console.log("二分 [1,2,3,4,5],50:", equalizeWater([1, 2, 3, 4, 5], 50)); // true
console.log("数学 [1,2,7],80:", equalizeWaterMath([1, 2, 7], 80)); // false
console.log("数学 [2,4,6],0:", equalizeWaterMath([2, 4, 6], 0)); // true

export {};
