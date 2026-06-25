// ============================================================
// 大厂算法真题（二） - TypeScript 解题合集
// ============================================================

// ============================================================
// 1. 百度2023秋招 - 交换一次获得长度为k的排列
// 给定一个排列，交换其中两个元素恰好一次，使得得到的排列中
// 最长的连续子数组长度恰好为k。求满足条件的交换方案数。
// ============================================================

// 方法：枚举交换 + 判断最长连续子数组
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function swapForKPermutation(nums: number[], k: number): number {
  const n = nums.length;

  // 计算当前排列的最长连续子数组长度
  function longestConsecutive(arr: number[]): number {
    const set = new Set(arr);
    let maxLen = 0;
    for (const num of arr) {
      if (!set.has(num - 1)) {
        let cur = num;
        let len = 1;
        while (set.has(cur + 1)) {
          cur++;
          len++;
        }
        maxLen = Math.max(maxLen, len);
      }
    }
    return maxLen;
  }

  let count = 0;

  // 枚举所有交换对 (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // 交换
      [nums[i], nums[j]] = [nums[j], nums[i]];
      if (longestConsecutive(nums) === k) {
        count++;
      }
      // 还原
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  return count;
}

// ============================================================
// 2. OPPO2023秋招提前批 - 小欧的区间取数
// 给定n个区间和m个查询，每个查询给出一个数x，
// 求有多少个区间包含x。
// ============================================================

// 方法：差分 + 前缀和
// 时间复杂度 O(n + maxVal + m)，空间复杂度 O(maxVal)
function intervalCount(intervals: number[][], queries: number[]): number[] {
  // 找到最大右端点
  let maxR = 0;
  for (const [l, r] of intervals) {
    maxR = Math.max(maxR, r);
  }

  // 差分数组
  const diff = new Array(maxR + 2).fill(0);
  for (const [l, r] of intervals) {
    diff[l]++;
    diff[r + 1]--;
  }

  // 前缀和得到每个点被覆盖的次数
  const cover = new Array(maxR + 2).fill(0);
  for (let i = 1; i <= maxR; i++) {
    cover[i] = cover[i - 1] + diff[i];
  }

  return queries.map((x) => (x >= 0 && x <= maxR ? cover[x] : 0));
}

// 方法2：排序 + 二分查找
// 时间复杂度 O((n+m) log n)，空间复杂度 O(n)
function intervalCountBinarySearch(
  intervals: number[][],
  queries: number[],
): number[] {
  const n = intervals.length;
  const starts = intervals.map(([, l]) => l).sort((a, b) => a - b);
  const ends = intervals.map(([r]) => r).sort((a, b) => a - b);

  return queries.map((x) => {
    // 包含x的区间数 = 左端点 <= x 的区间数 - 右端点 < x 的区间数
    const leftCount = lowerBound(starts, x + 1); // starts中 < x+1 的个数 = <= x
    const rightCount = lowerBound(ends, x); // ends中 < x 的个数
    return leftCount - rightCount;
  });
}

function lowerBound(arr: number[], target: number): number {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// ============================================================
// 3. 阿里蚂蚁2023秋招 - 讨厌鬼的区间
// 给定n个区间，求所有区间的交集。如果交集为空返回空数组。
// ============================================================

// 方法：贪心取交集
// 时间复杂度 O(n)，空间复杂度 O(1)
function intervalIntersection(intervals: number[][]): number[] {
  if (intervals.length === 0) return [];

  let maxL = intervals[0][0];
  let minR = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    maxL = Math.max(maxL, intervals[i][0]);
    minR = Math.min(minR, intervals[i][1]);
  }

  return maxL <= minR ? [maxL, minR] : [];
}

// ============================================================
// 4. OPPO2023秋招提前批 - 小欧数组求和
// 给定数组a，定义f(a)为数组中所有元素之和。
// 可以执行操作：选择一个下标i，将a[i]变为a[i]*a[i]。
// 最多执行k次操作，求f(a)的最大值。
// ============================================================

// 方法：贪心 + 大顶堆
// 时间复杂度 O((n+k) log n)，空间复杂度 O(n)
function arrayMaxSum(nums: number[], k: number): number {
  // 每次选择平方后增量最大的元素进行操作
  // 用大顶堆维护（这里用排序模拟）
  const arr = [...nums];

  for (let op = 0; op < k; op++) {
    // 找到平方增量最大的元素
    let bestIdx = 0;
    let bestGain = arr[0] * arr[0] - arr[0];
    for (let i = 1; i < arr.length; i++) {
      const gain = arr[i] * arr[i] - arr[i];
      if (gain > bestGain) {
        bestGain = gain;
        bestIdx = i;
      }
    }
    if (bestGain <= 0) break; // 如果增量非正，停止操作
    arr[bestIdx] = arr[bestIdx] * arr[bestIdx];
  }

  return arr.reduce((sum, val) => sum + val, 0);
}

// ============================================================
// 5. OPPO2023秋招提前批 - 小欧的圆覆盖
// 给定n个圆的圆心和半径，以及m个点，
// 求每个点被多少个圆覆盖。
// ============================================================

// 方法：暴力枚举
// 时间复杂度 O(n*m)，空间复杂度 O(m)
function circleCoverage(
  circles: { cx: number; cy: number; r: number }[],
  points: { x: number; y: number }[],
): number[] {
  return points.map(({ x, y }) => {
    let count = 0;
    for (const { cx, cy, r } of circles) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= r) count++;
    }
    return count;
  });
}

// ============================================================
// 6. 美团2023秋招 - 小美走公路
// 公路是一个环形，有n个站点，站点i到站点i+1的距离为dist[i]。
// 求从站点x到站点y的最短距离。
// ============================================================

// 方法：计算顺时针和逆时针距离取最小值
// 时间复杂度 O(n)，空间复杂度 O(1)
function shortestDistance(dist: number[], x: number, y: number): number {
  const n = dist.length;
  // 转为0-indexed
  const start = Math.min(x, y) - 1;
  const end = Math.max(x, y) - 1;

  // 顺时针距离
  let clockwise = 0;
  for (let i = start; i < end; i++) {
    clockwise += dist[i];
  }

  // 总距离
  const total = dist.reduce((sum, d) => sum + d, 0);

  // 逆时针距离 = 总距离 - 顺时针距离
  return Math.min(clockwise, total - clockwise);
}

// 方法2：前缀和优化
// 时间复杂度 O(n) 预处理 + O(1) 查询，空间复杂度 O(n)
function shortestDistancePrefix(
  dist: number[],
  queries: [number, number][],
): number[] {
  const n = dist.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + dist[i];
  }
  const total = prefix[n];

  return queries.map(([x, y]) => {
    const a = Math.min(x, y) - 1;
    const b = Math.max(x, y) - 1;
    const clockwise = prefix[b] - prefix[a];
    return Math.min(clockwise, total - clockwise);
  });
}

// ============================================================
// 7. 百度2023秋招 - 下棋游戏
// 在n*n的棋盘上，有两个棋子分别在(x1,y1)和(x2,y2)。
// 棋子每次可以移动到上下左右相邻格子，但不能移出棋盘。
// 两个棋子轮流移动，求两个棋子到达同一格子的最少移动次数之和。
// ============================================================

// 方法：BFS求最短距离
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function chessGame(
  n: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  // BFS从一个点到所有点的最短距离
  function bfs(sx: number, sy: number): number[][] {
    const dist = Array.from({ length: n }, () => new Array(n).fill(-1));
    dist[sx][sy] = 0;
    const queue: [number, number][] = [[sx, sy]];
    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    let head = 0;
    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && nx < n && ny >= 0 && ny < n && dist[nx][ny] === -1) {
          dist[nx][ny] = dist[cx][cy] + 1;
          queue.push([nx, ny]);
        }
      }
    }
    return dist;
  }

  const dist1 = bfs(x1, y1);
  const dist2 = bfs(x2, y2);

  // 找到两个棋子都能到达的格子中，距离之和最小的
  let minSum = Infinity;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (dist1[i][j] !== -1 && dist2[i][j] !== -1) {
        minSum = Math.min(minSum, dist1[i][j] + dist2[i][j]);
      }
    }
  }

  return minSum;
}

// 方法2：曼哈顿距离（如果棋盘无障碍）
// 时间复杂度 O(1)，空间复杂度 O(1)
function chessGameManhattan(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  // 两个棋子到中间某点的距离之和，最小值为曼哈顿距离
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// ============================================================
// 8. 小红书2023秋招提前批 - 小红的数组构造
// 给定正整数n和k，构造一个长度为n的数组，使得：
// 1. 数组中每个元素都是正整数
// 2. 数组元素之和等于k
// 3. 数组中不同的正整数种类数尽可能多
// ============================================================

// 方法：贪心，从1开始填
// 时间复杂度 O(sqrt(k))，空间复杂度 O(sqrt(k))
function constructArray(n: number, k: number): number[] | null {
  // 从1,2,3,...开始填，使得不同种类数最多
  // 前m个不同正整数之和为 m*(m+1)/2，需要 <= k
  // 且剩余元素个数 n-m >= 0，剩余值 k - m*(m+1)/2 >= m（剩余位置至少填1，但要与前面的不同）

  let m = 0; // 不同正整数种类数
  let sum = 0;
  while (sum + (m + 1) <= k && m + 1 <= n) {
    m++;
    sum += m;
  }

  if (m === 0) return n === k ? new Array(n).fill(1) : null;

  const result: number[] = [];
  for (let i = 1; i <= m; i++) {
    result.push(i);
  }

  // 剩余 n-m 个位置填1（与已有数字相同的也算）
  const remaining = k - sum;
  const remainingCount = n - m;

  if (remainingCount < 0) return null;
  if (remainingCount === 0) return remaining === 0 ? result : null;
  if (remaining < remainingCount) return null; // 剩余值不够填

  // 剩余位置用能填的值填充
  const extraPer = Math.floor(remaining / remainingCount);
  const extraRem = remaining % remainingCount;

  for (let i = 0; i < remainingCount; i++) {
    result.push(extraPer + (i < extraRem ? 1 : 0));
  }

  return result;
}

// ============================================================
// 9. 阿里蚂蚁2023秋招 - 奇偶操作
// 给定一个数组，每次操作选择一个偶数，将其除以2。
// 求使数组中所有数都变为奇数的最少操作次数。
// ============================================================

// 方法：对每个偶数计算需要除以2的次数
// 时间复杂度 O(n * log(maxVal))，空间复杂度 O(1)
function oddOperation(nums: number[]): number {
  let totalOps = 0;

  for (const num of nums) {
    let val = num;
    while (val % 2 === 0) {
      val /= 2;
      totalOps++;
    }
  }

  return totalOps;
}

// 方法2：位运算优化
// 时间复杂度 O(n)，空间复杂度 O(1)
function oddOperationBitwise(nums: number[]): number {
  let totalOps = 0;

  for (const num of nums) {
    // 统计末尾0的个数
    totalOps += Math.log2(num & -num);
  }

  return Math.round(totalOps);
}

// ============================================================
// 10. 科大讯飞2023非凡计划 - 汤姆和杰瑞
// 汤姆在位置0，杰瑞在位置n。汤姆每次向右走1或2步，
// 杰瑞每次向左走1或2步。求两人相遇的方案数（模10^9+7）。
// ============================================================

// 方法：动态规划
// 时间复杂度 O(n)，空间复杂度 O(n)
function tomAndJerry(n: number): number {
  const MOD = 1e9 + 7;
  // dp[i] = 两人之间的距离为i时的方案数
  // 距离减少1：汤姆+1或杰瑞-1（2种走法组合产生距离减少1或2或3或4）
  // 简化：汤姆走a步(1或2)，杰瑞走b步(1或2)，距离减少a+b
  // a+b可以是2,3,4

  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // 距离为0，已相遇

  for (let i = 1; i <= n; i++) {
    // 距离减少2: a=1,b=1 (1种组合)
    if (i >= 2) dp[i] = (dp[i] + dp[i - 2]) % MOD;
    // 距离减少3: a=1,b=2 或 a=2,b=1 (2种组合)
    if (i >= 3) dp[i] = (dp[i] + 2 * dp[i - 3]) % MOD;
    // 距离减少4: a=2,b=2 (1种组合)
    if (i >= 4) dp[i] = (dp[i] + dp[i - 4]) % MOD;
  }

  return dp[n];
}

// ============================================================
// 11. 科大讯飞2023非凡计划 - 数组的最小距离
// 给定一个数组，定义两个元素的距离为它们下标之差的绝对值。
// 求数组中所有相同值的元素对之间的最小距离。
// ============================================================

// 方法：哈希表 + 遍历
// 时间复杂度 O(n)，空间复杂度 O(n)
function minDistanceSameValue(nums: number[]): number {
  const indexMap = new Map<number, number[]>(); // 值 -> 下标列表

  for (let i = 0; i < nums.length; i++) {
    if (!indexMap.has(nums[i])) {
      indexMap.set(nums[i], []);
    }
    indexMap.get(nums[i])!.push(i);
  }

  let minDist = Infinity;
  for (const indices of indexMap.values()) {
    if (indices.length < 2) continue;
    // 相邻下标差最小
    for (let i = 1; i < indices.length; i++) {
      minDist = Math.min(minDist, indices[i] - indices[i - 1]);
    }
  }

  return minDist === Infinity ? -1 : minDist;
}

// 方法2：一次遍历，记录每个值最近出现的下标
// 时间复杂度 O(n)，空间复杂度 O(n)
function minDistanceSameValueOnePass(nums: number[]): number {
  const lastIndex = new Map<number, number>();
  let minDist = Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (lastIndex.has(nums[i])) {
      minDist = Math.min(minDist, i - lastIndex.get(nums[i])!);
    }
    lastIndex.set(nums[i], i);
  }

  return minDist === Infinity ? -1 : minDist;
}

// ============================================================
// 12. 荣耀2023秋招 - 根据字符串中的时间信息排序并输出
// 给定一组字符串，每个字符串中包含一个时间（格式HH:MM:SS），
// 按时间从早到晚排序后输出。
// ============================================================

// 方法：提取时间 + 排序
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function sortByTime(strings: string[]): string[] {
  // 提取时间字符串并转换为秒用于比较
  function extractTimeSeconds(s: string): number {
    const match = s.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return 0;
    const [, h, m, sec] = match;
    return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(sec);
  }

  return [...strings].sort(
    (a, b) => extractTimeSeconds(a) - extractTimeSeconds(b),
  );
}

// ============================================================
// 13. 科大讯飞2023非凡计划 - 禁着点的方案数
// 在n*n的棋盘上，有些点是禁着点（不能经过）。
// 从(0,0)走到(n-1,n-1)，只能向右或向下走，求方案数。
// ============================================================

// 方法：动态规划
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function forbiddenPoints(n: number, forbidden: Set<string>): number {
  const MOD = 1e9 + 7;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // 如果起点是禁着点，方案数为0
  if (forbidden.has("0,0")) return 0;

  dp[0][0] = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      if (forbidden.has(`${i},${j}`)) {
        dp[i][j] = 0;
        continue;
      }
      if (i > 0) dp[i][j] = (dp[i][j] + dp[i - 1][j]) % MOD;
      if (j > 0) dp[i][j] = (dp[i][j] + dp[i][j - 1]) % MOD;
    }
  }

  return dp[n - 1][n - 1];
}

// 方法2：空间优化（滚动数组）
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function forbiddenPointsOptimized(n: number, forbidden: Set<string>): number {
  const MOD = 1e9 + 7;
  const dp = new Array(n).fill(0);

  if (forbidden.has("0,0")) return 0;

  dp[0] = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      if (forbidden.has(`${i},${j}`)) {
        dp[j] = 0;
        continue;
      }
      if (j > 0) dp[j] = (dp[j] + dp[j - 1]) % MOD;
    }
  }

  return dp[n - 1];
}

// ============================================================
// 14. 微众银行2023秋招 - 切糖果
// 有n个糖果排成一排，每个糖果的甜度为sweetness[i]。
// 需要切k-1刀分成k段，使得最小段的甜度之和尽可能大。
// ============================================================

// 方法：二分答案
// 时间复杂度 O(n log(sum))，空间复杂度 O(1)
function cutCandy(sweetness: number[], k: number): number {
  let lo = Math.min(...sweetness);
  let hi = sweetness.reduce((sum, s) => sum + s, 0);

  // 检查是否可以分成至少k段，每段之和 >= target
  function canSplit(target: number): boolean {
    let count = 0;
    let current = 0;
    for (const s of sweetness) {
      current += s;
      if (current >= target) {
        count++;
        current = 0;
      }
    }
    return count >= k;
  }

  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (canSplit(mid)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  return lo;
}

// ============================================================
// 15. 美团2023秋招 - 小美的排列询问
// 给定一个1~n的排列，有q次询问，每次询问一个区间[l,r]，
// 判断该区间内的数是否构成一个连续的排列（即恰好包含l到r的所有整数）。
// ============================================================

// 方法：判断区间最大值-最小值+1 == 区间长度
// 时间复杂度 O(n * q)，空间复杂度 O(1)
function permutationQuery(perm: number[], queries: number[][]): boolean[] {
  return queries.map(([l, r]) => {
    // 转为0-indexed
    const left = l - 1;
    const right = r - 1;

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let i = left; i <= right; i++) {
      minVal = Math.min(minVal, perm[i]);
      maxVal = Math.max(maxVal, perm[i]);
    }

    return maxVal - minVal + 1 === right - left + 1;
  });
}

// 方法2：ST表/RMQ优化区间最值查询
// 时间复杂度 O(n log n + q)，空间复杂度 O(n log n)
class SparseTable {
  private table: number[][];
  private minTable: number[][];

  constructor(arr: number[]) {
    const n = arr.length;
    const k = Math.floor(Math.log2(n)) + 1;
    this.table = Array.from({ length: k }, () => new Array(n).fill(0));
    this.minTable = Array.from({ length: k }, () => new Array(n).fill(0));

    // 初始化
    for (let i = 0; i < n; i++) {
      this.table[0][i] = arr[i];
      this.minTable[0][i] = arr[i];
    }

    // 预处理
    for (let j = 1; j < k; j++) {
      for (let i = 0; i + (1 << j) <= n; i++) {
        this.table[j][i] = Math.max(
          this.table[j - 1][i],
          this.table[j - 1][i + (1 << (j - 1))],
        );
        this.minTable[j][i] = Math.min(
          this.minTable[j - 1][i],
          this.minTable[j - 1][i + (1 << (j - 1))],
        );
      }
    }
  }

  queryMax(l: number, r: number): number {
    const k = Math.floor(Math.log2(r - l + 1));
    return Math.max(this.table[k][l], this.table[k][r - (1 << k) + 1]);
  }

  queryMin(l: number, r: number): number {
    const k = Math.floor(Math.log2(r - l + 1));
    return Math.min(this.minTable[k][l], this.minTable[k][r - (1 << k) + 1]);
  }
}

function permutationQueryRMQ(perm: number[], queries: number[][]): boolean[] {
  const st = new SparseTable(perm);

  return queries.map(([l, r]) => {
    const left = l - 1;
    const right = r - 1;
    const maxVal = st.queryMax(left, right);
    const minVal = st.queryMin(left, right);
    return maxVal - minVal + 1 === right - left + 1;
  });
}

// ============================================================
// 16. 阿里2023春招实习 - 合法的三元组
// 给定数组nums和目标值target，求满足i<j<k且
// nums[i]+nums[j]+nums[k]<target的三元组个数。
// ============================================================

// 方法：排序 + 双指针
// 时间复杂度 O(n^2)，空间复杂度 O(1)
function validTriplets(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n - 2; i++) {
    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < target) {
        // nums[i] + nums[left] + nums[left+1...right] 都 < target
        count += right - left;
        left++;
      } else {
        right--;
      }
    }
  }

  return count;
}

// ============================================================
// 17. 小红书2023秋招 - 推荐系统
// 有n个物品，每个物品有两个维度的评分a[i]和b[i]。
// 一个物品是"被推荐的"当且仅当不存在另一个物品在两个维度上都不劣于它
// 且至少一个维度严格优于它（即Pareto最优）。
// 求所有被推荐物品的下标。
// ============================================================

// 方法：排序 + 扫描
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function recommendedItems(items: [number, number][]): number[] {
  const n = items.length;
  const indexed = items.map((item, i) => ({ a: item[0], b: item[1], idx: i }));

  // 按a降序排列，a相同的按b降序
  indexed.sort((x, y) => y.a - x.a || y.b - x.b);

  const result: number[] = [];
  let maxB = -Infinity;

  // 从前往后扫描，维护b的最大值
  // 当前元素的a <= 前面元素的a（因为已排序）
  // 如果当前元素的b > maxB，说明没有元素能在两个维度都 >= 它
  for (const item of indexed) {
    if (item.b > maxB) {
      result.push(item.idx);
      maxB = item.b;
    }
  }

  return result.sort((a, b) => a - b);
}

// ============================================================
// 18. 贝壳2021秋招 - 牛妹的字符串
// 给定字符串s，可以进行操作：选择一个字符，将其插入到任意位置。
// 求使字符串变成回文串的最少操作次数。
// ============================================================

// 方法：求原串与反串的LCS，最少操作 = n - LCS
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function niuMeiString(s: string): number {
  const n = s.length;
  const rev = s.split("").reverse().join("");

  // 求s和rev的最长公共子序列
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === rev[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return n - dp[n][n];
}

// 方法2：空间优化
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function niuMeiStringOptimized(s: string): number {
  const n = s.length;
  const rev = s.split("").reverse().join("");

  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === rev[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
    curr.fill(0);
  }

  return n - prev[n];
}

// ============================================================
// 19. 阿里淘天2023秋招 - 讨厌鬼的排列
// 给定一个1~n的排列p，定义f(p)为排列中满足p[i]=i的位置个数。
// 对于排列p的每一个位置i，求交换p[i]和p[p[i]]后f(p)的最大值。
// ============================================================

// 方法：模拟交换 + 计数
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function annoyingPermutation(perm: number[]): number[] {
  const n = perm.length;
  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    // 交换 p[i] 和 p[p[i]]（注意p是1-indexed）
    const arr = [...perm];
    const j = arr[i] - 1; // p[i] 对应的0-indexed位置
    [arr[i], arr[j]] = [arr[j], arr[i]];

    // 计算固定点个数
    let count = 0;
    for (let k = 0; k < n; k++) {
      if (arr[k] === k + 1) count++;
    }
    result.push(count);
  }

  return result;
}

// 方法2：优化 - 分析交换对固定点的影响
// 时间复杂度 O(n)，空间复杂度 O(n)
function annoyingPermutationOptimized(perm: number[]): number[] {
  const n = perm.length;

  // 先计算原始固定点个数
  let baseFixed = 0;
  for (let i = 0; i < n; i++) {
    if (perm[i] === i + 1) baseFixed++;
  }

  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    const j = perm[i] - 1;

    // 分析交换 arr[i] 和 arr[j] 对固定点的影响
    let delta = 0;

    // 交换前：检查 i 和 j 是否是固定点
    if (perm[i] === i + 1) delta--; // i 原本是固定点，交换后可能不是
    if (j !== i && perm[j] === j + 1) delta--; // j 原本是固定点，交换后可能不是

    // 交换后：检查 i 和 j 是否变成固定点
    // 交换后 arr[i] = 原 arr[j] = perm[j], arr[j] = 原 arr[i] = perm[i]
    if (perm[j] === i + 1) delta++; // 交换后 i 变成固定点
    if (j !== i && perm[i] === j + 1) delta++; // 交换后 j 变成固定点

    result.push(baseFixed + delta);
  }

  return result;
}

// ============================================================
// 20. Bilibili2023秋招 - 最长同值路径
// 给定一棵二叉树，求树中最长的同值路径长度。
// 同值路径指路径上所有节点的值都相同的路径。
// ============================================================

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法：DFS后序遍历
// 时间复杂度 O(n)，空间复杂度 O(h)，h为树高
function longestSameValuePath(root: TreeNode | null): number {
  let maxLen = 0;

  // 返回从当前节点出发，向左/右延伸的最长同值路径长度
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;

    const leftLen = dfs(node.left);
    const rightLen = dfs(node.right);

    // 左子树同值路径长度
    let leftSame = 0;
    if (node.left && node.left.val === node.val) {
      leftSame = leftLen + 1;
    }

    // 右子树同值路径长度
    let rightSame = 0;
    if (node.right && node.right.val === node.val) {
      rightSame = rightLen + 1;
    }

    // 经过当前节点的同值路径（左-当前-右）
    maxLen = Math.max(maxLen, leftSame + rightSame);

    // 返回向左或向右延伸的最大同值路径长度
    return Math.max(leftSame, rightSame);
  }

  dfs(root);
  return maxLen;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 百度2023秋招 - 交换一次获得长度为k的排列 =====");
console.log(swapForKPermutation([1, 3, 2, 4], 3));

console.log("\n===== 2. OPPO2023秋招 - 小欧的区间取数 =====");
console.log(
  intervalCount(
    [
      [1, 5],
      [3, 7],
      [2, 6],
    ],
    [3, 5, 8],
  ),
);
console.log(
  intervalCountBinarySearch(
    [
      [1, 5],
      [3, 7],
      [2, 6],
    ],
    [3, 5, 8],
  ),
);

console.log("\n===== 3. 阿里蚂蚁2023秋招 - 讨厌鬼的区间 =====");
console.log(
  intervalIntersection([
    [1, 5],
    [3, 7],
    [2, 6],
  ]),
);
console.log(
  intervalIntersection([
    [1, 2],
    [5, 6],
  ]),
);

console.log("\n===== 4. OPPO2023秋招 - 小欧数组求和 =====");
console.log(arrayMaxSum([2, 3, 1], 2));

console.log("\n===== 5. OPPO2023秋招 - 小欧的圆覆盖 =====");
console.log(
  circleCoverage(
    [
      { cx: 0, cy: 0, r: 5 },
      { cx: 3, cy: 0, r: 3 },
    ],
    [
      { x: 1, y: 0 },
      { x: 6, y: 0 },
    ],
  ),
);

console.log("\n===== 6. 美团2023秋招 - 小美走公路 =====");
console.log(shortestDistance([1, 2, 3, 4], 1, 3));
console.log(
  shortestDistancePrefix(
    [1, 2, 3, 4],
    [
      [1, 3],
      [2, 4],
    ],
  ),
);

console.log("\n===== 7. 百度2023秋招 - 下棋游戏 =====");
console.log(chessGame(3, 0, 0, 2, 2));
console.log(chessGameManhattan(0, 0, 2, 2));

console.log("\n===== 8. 小红书2023秋招 - 小红的数组构造 =====");
console.log(constructArray(5, 15));

console.log("\n===== 9. 阿里蚂蚁2023秋招 - 奇偶操作 =====");
console.log(oddOperation([4, 8, 5, 2]));
console.log(oddOperationBitwise([4, 8, 5, 2]));

console.log("\n===== 10. 科大讯飞2023 - 汤姆和杰瑞 =====");
console.log(tomAndJerry(4));

console.log("\n===== 11. 科大讯飞2023 - 数组的最小距离 =====");
console.log(minDistanceSameValue([1, 2, 3, 1, 2, 1]));
console.log(minDistanceSameValueOnePass([1, 2, 3, 1, 2, 1]));

console.log("\n===== 12. 荣耀2023秋招 - 根据字符串中的时间排序 =====");
console.log(
  sortByTime(["abc12:30:00def", "xyz08:15:30uvw", "test23:59:59end"]),
);

console.log("\n===== 13. 科大讯飞2023 - 禁着点的方案数 =====");
console.log(forbiddenPoints(3, new Set(["1,1"])));
console.log(forbiddenPointsOptimized(3, new Set(["1,1"])));

console.log("\n===== 14. 微众银行2023秋招 - 切糖果 =====");
console.log(cutCandy([1, 2, 3, 4, 5, 6, 7, 8, 9], 3));

console.log("\n===== 15. 美团2023秋招 - 小美的排列询问 =====");
console.log(
  permutationQuery(
    [2, 1, 4, 3],
    [
      [1, 2],
      [3, 4],
    ],
  ),
);
console.log(
  permutationQueryRMQ(
    [2, 1, 4, 3],
    [
      [1, 2],
      [3, 4],
    ],
  ),
);

console.log("\n===== 16. 阿里2023春招 - 合法的三元组 =====");
console.log(validTriplets([1, 2, 3, 4, 5], 8));

console.log("\n===== 17. 小红书2023秋招 - 推荐系统 =====");
console.log(
  recommendedItems([
    [3, 2],
    [1, 4],
    [2, 3],
    [4, 1],
  ]),
);

console.log("\n===== 18. 贝壳2021秋招 - 牛妹的字符串 =====");
console.log(niuMeiString("abca"));
console.log(niuMeiStringOptimized("abca"));

console.log("\n===== 19. 阿里淘天2023秋招 - 讨厌鬼的排列 =====");
console.log(annoyingPermutation([2, 1, 3]));
console.log(annoyingPermutationOptimized([2, 1, 3]));

console.log("\n===== 20. Bilibili2023秋招 - 最长同值路径 =====");
const tree20 = new TreeNode(
  5,
  new TreeNode(4, new TreeNode(1), new TreeNode(1)),
  new TreeNode(5, null, new TreeNode(5)),
);
console.log(longestSameValuePath(tree20));

export {};
