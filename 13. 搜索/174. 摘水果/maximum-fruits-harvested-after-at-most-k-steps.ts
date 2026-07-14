// ============================================================
// 174. 摘水果
// ============================================================
// LeetCode 2106. Maximum Fruits Harvested After at Most K Steps
// fruits[i] = [position, amount]，从 startPos 出发，最多走 k 步，
// 求最多能摘多少水果。

// 方法1：二分查找 + 前缀和
function maxTotalFruits(fruits: number[][], startPos: number, k: number): number {
  const n = fruits.length;
  // 前缀和
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + fruits[i][1];
  }

  // 查询位置范围 [l, r] 内的水果总数
  function sumRange(l: number, r: number): number {
    // 二分找第一个 position >= l
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fruits[mid][0] < l) lo = mid + 1;
      else hi = mid;
    }
    const start = lo;
    // 二分找第一个 position > r
    lo = 0;
    hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fruits[mid][0] <= r) lo = mid + 1;
      else hi = mid;
    }
    const end = lo;
    return prefix[end] - prefix[start];
  }

  let result = 0;
  // 策略1：先左走 leftDist，再右走 rightDist，总步数 = 2*leftDist + rightDist <= k
  for (let leftDist = 0; leftDist <= k; leftDist++) {
    const rightDist = k - 2 * leftDist;
    if (rightDist < 0) break;
    result = Math.max(result, sumRange(startPos - leftDist, startPos + rightDist));
  }
  // 策略2：先右走 rightDist，再左走 leftDist，总步数 = 2*rightDist + leftDist <= k
  for (let rightDist = 0; rightDist <= k; rightDist++) {
    const leftDist = k - 2 * rightDist;
    if (leftDist < 0) break;
    result = Math.max(result, sumRange(startPos - leftDist, startPos + rightDist));
  }
  return result;
}

// 方法2：滑动窗口
function maxTotalFruitsSliding(fruits: number[][], startPos: number, k: number): number {
  const n = fruits.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + fruits[i][1];
  }
  // 将 startPos 也视为一个位置点
  // 滑动窗口：对于窗口 [left, right]，如果从 startPos 可以覆盖整个窗口
  // 所需最小步数 = min(2*(startPos-fruits[left][0]) + (fruits[right][0]-startPos),
  //                    2*(fruits[right][0]-startPos) + (startPos-fruits[left][0]))
  let result = 0;
  let left = 0;
  for (let right = 0; right < n; right++) {
    while (left <= right) {
      const l = fruits[left][0];
      const r = fruits[right][0];
      if (l > startPos) {
        // 窗口全在右侧
        if (r - startPos <= k) {
          result = Math.max(result, prefix[right + 1] - prefix[left]);
          break;
        } else {
          left++;
        }
      } else if (r < startPos) {
        // 窗口全在左侧
        if (startPos - l <= k) {
          result = Math.max(result, prefix[right + 1] - prefix[left]);
          break;
        } else {
          left++;
        }
      } else {
        // 窗口横跨 startPos
        const cost = Math.min(
          2 * (startPos - l) + (r - startPos),
          2 * (r - startPos) + (startPos - l),
        );
        if (cost <= k) {
          result = Math.max(result, prefix[right + 1] - prefix[left]);
          break;
        } else {
          left++;
        }
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 174. 摘水果 =====");
console.log(
  "二分 [[2,8],[6,3],[8,6]],5,4:",
  maxTotalFruits(
    [
      [2, 8],
      [6, 3],
      [8, 6],
    ],
    5,
    4,
  ),
); // 9
console.log(
  "二分 [[0,9],[4,1],[5,7],[6,2],[7,4],[10,9]],5,4:",
  maxTotalFruits(
    [
      [0, 9],
      [4, 1],
      [5, 7],
      [6, 2],
      [7, 4],
      [10, 9],
    ],
    5,
    4,
  ),
); // 14
console.log(
  "滑动 [[2,8],[6,3],[8,6]],5,4:",
  maxTotalFruitsSliding(
    [
      [2, 8],
      [6, 3],
      [8, 6],
    ],
    5,
    4,
  ),
); // 9

export {};
