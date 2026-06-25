// ============================================================
// 大厂算法真题 - TypeScript 解题合集（三）· 小米/美团/米哈游专场
// ============================================================

// ============================================================
// 1. 小米 - 手机通信校准
// 小明在测试手机通信，手机需要接收n个频段的信号，初始时手机
// 已设置好n个频段（可重复）。每个频段必须恰好被覆盖一次，
// 否则通信失败。手机可以执行两种操作：
// 1. 增加一个频段（任意值），消耗1次操作
// 2. 删除一个频段，消耗1次操作
// 求最少操作次数使手机恰好覆盖所有需要的频段各一次。
// 等价于：两个数组的最少增删操作次数使它们成为同一集合。
// ============================================================

// 方法：哈希表统计频次差
// 时间复杂度 O(n + m)，空间复杂度 O(n + m)
function phoneCalibration(
  required: number[],
  current: number[]
): number {
  const freq = new Map<number, number>();

  // 统计所需频段
  for (const band of required) {
    freq.set(band, (freq.get(band) ?? 0) + 1);
  }
  // 当前已有频段抵消
  for (const band of current) {
    freq.set(band, (freq.get(band) ?? 0) - 1);
  }

  // 所有差值的绝对值之和即为最少操作次数
  let ops = 0;
  for (const count of freq.values()) {
    ops += Math.abs(count);
  }
  return ops;
}

// ============================================================
// 2. 小米 - 精华帖子
// 论坛中有n个帖子，每个帖子有阅读数和点赞数。精华帖子的判定
// 条件为：点赞数严格大于阅读数的一半。请统计精华帖子的数量。
// ============================================================

// 方法：遍历统计
// 时间复杂度 O(n)，空间复杂度 O(1)
function featuredPosts(posts: { reads: number; likes: number }[]): number {
  let count = 0;
  for (const post of posts) {
    // 点赞数 > 阅读数 / 2，即 2 * likes > reads
    if (2 * post.likes > post.reads) {
      count++;
    }
  }
  return count;
}

// ============================================================
// 3. 小米 - 最高的楼
// 城市中有n栋楼，第i栋楼有h[i]层。现进行m次操作，每次操作
// 将区间[l, r]内的楼都加盖一层。求最终最高的楼有多少层。
// ============================================================

// 方法1：差分数组
// 时间复杂度 O(n + m)，空间复杂度 O(n)
function tallestBuildingDiff(heights: number[], operations: [number, number][]): number {
  const n = heights.length;
  const diff = new Array(n + 1).fill(0);

  // 构建原始差分数组
  for (let i = 0; i < n; i++) {
    diff[i] += heights[i];
    diff[i + 1] -= heights[i];
  }

  // 对每个区间操作，在差分数组上 +1 / -1
  for (const [l, r] of operations) {
    diff[l] += 1;
    diff[r + 1] -= 1;
  }

  // 还原并找最大值
  let maxVal = 0;
  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += diff[i];
    maxVal = Math.max(maxVal, cur);
  }
  return maxVal;
}

// 方法2：暴力模拟（仅适用于数据量小的情况）
// 时间复杂度 O(n * m)，空间复杂度 O(n)
function tallestBuildingBrute(heights: number[], operations: [number, number][]): number {
  const n = heights.length;
  const h = [...heights];

  for (const [l, r] of operations) {
    for (let i = l; i <= r; i++) {
      h[i]++;
    }
  }

  return Math.max(...h);
}

// ============================================================
// 4. 小米 - 手机流畅运行的秘密
// 手机有n个后台进程，每个进程占用mem[i]内存。为保证手机流畅，
// 需要关闭一些进程使剩余进程的总内存不超过limit。
// 求最少需要关闭多少个进程。（每个进程只能选择关闭或保留）
// ============================================================

// 方法：贪心 - 优先关闭占用内存最大的进程
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function phoneSmooth(
  mem: number[],
  limit: number
): number {
  const total = mem.reduce((a, b) => a + b, 0);
  // 需要释放的内存量
  const need = total - limit;

  if (need <= 0) return 0; // 已满足条件

  // 从大到小排序，贪心关闭最大进程
  mem.sort((a, b) => b - a);

  let freed = 0;
  let count = 0;
  for (const m of mem) {
    freed += m;
    count++;
    if (freed >= need) break;
  }
  return count;
}

// ============================================================
// 5. 小米 - 讨厌鬼的组合帖子
// 讨厌鬼在论坛发了一组帖子，共n篇，每篇帖子有一个热度值a[i]。
// 他想选出若干篇帖子组合成一个精华帖，要求：
// 选出的帖子热度值之和最大，且不能选相邻的帖子。
// 求最大热度值之和。（等价于 LeetCode 198. 打家劫舍）
// ============================================================

// 方法1：动态规划 - 滚动变量
// 时间复杂度 O(n)，空间复杂度 O(1)
function combinedPosts(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = 0; // dp[i - 2]
  let prev1 = nums[0]; // dp[i - 1]

  for (let i = 1; i < nums.length; i++) {
    // 选当前：prev2 + nums[i]；不选：prev1
    const cur = Math.max(prev2 + nums[i], prev1);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

// 方法2：动态规划 - 数组版
// 时间复杂度 O(n)，空间复杂度 O(n)
function combinedPostsDP(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  // dp[i] 表示前i篇帖子能获得的最大热度值
  const dp = new Array(n).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[n - 1];
}

// ============================================================
// 6. 美团 - 小美的数组重排
// 小美有一个长度为n的数组a，她可以将数组任意重排。
// 重排后，她希望对于每个位置i，a[i]都不等于i（1-indexed）。
// 求是否存在这样的重排方案。（等价于判断错排是否存在）
// ============================================================

// 方法：排序 + 旋转 + 修复
// 将数组排序后整体右移一位（旋转），再检查是否有位置 i (1-indexed)
// 满足 a[i] = i，如果有则与相邻位置交换。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function arrayRearrange(a: number[]): number[] | null {
  const n = a.length;
  // 统计每个值的出现次数
  const count = new Map<number, number>();
  for (const val of a) {
    count.set(val, (count.get(val) ?? 0) + 1);
  }

  // 如果某个值出现次数超过 n/2，无法错排
  for (const c of count.values()) {
    if (c > Math.floor(n / 2)) return null;
  }

  // 排序后旋转一位（每个元素右移一位，最后一个到第一位）
  const sorted = [...a].sort((x, y) => x - y);
  const result = new Array(n);
  result[0] = sorted[n - 1];
  for (let i = 1; i < n; i++) {
    result[i] = sorted[i - 1];
  }

  // 修复：检查 1-indexed 位置是否有 a[i] = i
  for (let i = 0; i < n; i++) {
    if (result[i] === i + 1) {
      // 找一个可以交换的相邻位置
      let swapped = false;
      if (i + 1 < n && result[i + 1] !== i + 1) {
        // 与后一个位置交换
        [result[i], result[i + 1]] = [result[i + 1], result[i]];
        swapped = true;
      } else if (i - 1 >= 0 && result[i - 1] !== i + 1) {
        // 与前一个位置交换
        [result[i], result[i - 1]] = [result[i - 1], result[i]];
        swapped = true;
      }
      // 如果都没法交换，在旋转后的数组中这种情况很少发生
      // 因为已通过 count > n/2 的检查
      if (!swapped) {
        // 找任意一个可以交换的位置
        for (let j = 0; j < n; j++) {
          if (j !== i && result[j] !== i + 1 && result[i] !== j + 1) {
            [result[i], result[j]] = [result[j], result[i]];
            swapped = true;
            break;
          }
        }
      }
    }
  }

  return result;
}

// ============================================================
// 7. 小米 - 矩形田地
// 农夫有一块 h × w 的矩形田地，田地中有一些障碍物。
// 障碍物坐标在blocked数组中给出。求田地中最大连续矩形
// （无障碍物）的面积。
// ============================================================

// 方法：逐行计算最大矩形面积（柱状图法）
// 时间复杂度 O(h * w)，空间复杂度 O(w)
function maxFarmland(
  h: number,
  w: number,
  blocked: [number, number][]
): number {
  // 构建障碍物集合
  const blockedSet = new Set<string>();
  for (const [r, c] of blocked) {
    blockedSet.add(`${r},${c}`);
  }

  // heights[i] 表示以当前行为底，第i列往上连续无障碍的格子数
  const heights = new Array(w).fill(0);
  let maxArea = 0;

  for (let row = 0; row < h; row++) {
    // 更新每列的高度
    for (let col = 0; col < w; col++) {
      if (blockedSet.has(`${row},${col}`)) {
        heights[col] = 0;
      } else {
        heights[col]++;
      }
    }

    // 用单调栈求当前行的最大矩形面积
    const stack: number[] = [];
    for (let i = 0; i <= w; i++) {
      const curH = i < w ? heights[i] : 0;
      while (stack.length > 0 && heights[stack[stack.length - 1]] > curH) {
        const top = stack.pop()!;
        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        maxArea = Math.max(maxArea, heights[top] * width);
      }
      stack.push(i);
    }
  }

  return maxArea;
}

// ============================================================
// 8. 小米 - 删点成林
// 给定二叉树的根节点和一组要删除的节点值，删除这些节点后，
// 剩余的部分会形成一片森林（多棵树）。返回森林中所有树的
// 根节点列表。（LeetCode 1110. Delete Nodes And Return Forest）
// ============================================================

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 辅助函数：数组转二叉树（层序）
function createTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 方法：后序遍历 + 集合判断
// 时间复杂度 O(n)，空间复杂度 O(n + h)
function deleteNodesForest(
  root: TreeNode | null,
  toDelete: number[]
): TreeNode[] {
  const deleteSet = new Set(toDelete);
  const forest: TreeNode[] = [];

  function dfs(node: TreeNode | null, isRoot: boolean): TreeNode | null {
    if (!node) return null;

    // 判断当前节点是否需要删除
    const shouldDelete = deleteSet.has(node.val);
    // 如果当前节点是根且不需要删除，加入森林
    if (isRoot && !shouldDelete) {
      forest.push(node);
    }

    // 递归处理子节点，如果当前节点被删除，子节点成为新的根
    node.left = dfs(node.left, shouldDelete);
    node.right = dfs(node.right, shouldDelete);

    // 被删除的节点返回 null
    return shouldDelete ? null : node;
  }

  dfs(root, true);
  return forest;
}

// ============================================================
// 9. 小米 - 迷宫
// 给定一个 n × m 的迷宫，0 表示通路，1 表示墙壁。
// 从左上角 (0,0) 出发，到达右下角 (n-1, m-1)。
// 求最短路径的步数，若无法到达返回 -1。
// ============================================================

// 方法：BFS 广度优先搜索
// 时间复杂度 O(n * m)，空间复杂度 O(n * m)
function mazeShortestPath(maze: number[][]): number {
  const n = maze.length;
  const m = maze[0].length;

  if (maze[0][0] === 1 || maze[n - 1][m - 1] === 1) return -1;

  const visited = Array.from({ length: n }, () => new Array(m).fill(false));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // BFS 队列：[行, 列, 步数]
  const queue: [number, number, number][] = [[0, 0, 0]];
  visited[0][0] = true;

  while (queue.length > 0) {
    const [r, c, steps] = queue.shift()!;

    // 到达终点
    if (r === n - 1 && c === m - 1) return steps;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < n &&
        nc >= 0 && nc < m &&
        !visited[nr][nc] &&
        maze[nr][nc] === 0
      ) {
        visited[nr][nc] = true;
        queue.push([nr, nc, steps + 1]);
      }
    }
  }

  return -1; // 无法到达
}

// ============================================================
// 10. 小米 - 攀比
// 班级里有n个同学，每个同学有一个成绩score[i]。
// 定义"攀比值"为：对于同学i，找到成绩严格大于他的同学中
// 成绩最低的那个成绩，如果不存在则攀比值为-1。
// 求每个同学的攀比值。
// ============================================================

// 方法：排序 + 遍历
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function comparisonValue(scores: number[]): number[] {
  const n = scores.length;
  // 排序并去重，得到所有不同的成绩值
  const sorted = [...new Set(scores)].sort((a, b) => a - b);

  // 对每个成绩，找到严格大于它的最小值
  const nextMap = new Map<number, number>();
  for (let i = 0; i < sorted.length - 1; i++) {
    nextMap.set(sorted[i], sorted[i + 1]);
  }

  // 映射回原始顺序
  return scores.map((s) => nextMap.get(s) ?? -1);
}

// ============================================================
// 11. 小米 - 巧克力
// 有n块巧克力，第i块巧克力有a[i]个格子。每天可以吃一块巧克力
// 的一个格子。要求每天吃的巧克力编号严格递增（即第2天吃的
// 巧克力编号 > 第1天吃的，以此类推）。
// 求最多可以吃多少天。
// ============================================================

// 方法：贪心 - 排序后依次消耗
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function chocolateDays(chocolates: number[]): number {
  // 将巧克力按格子数从小到大排序
  chocolates.sort((a, b) => a - b);

  let days = 0;
  let prevIdx = -1; // 上一次吃的巧克力索引

  for (let i = 0; i < chocolates.length; i++) {
    if (chocolates[i] > 0 && i > prevIdx) {
      chocolates[i]--; // 吃一格
      days++;
      prevIdx = i; // 更新上次吃的索引
      // 如果当前巧克力还有格子，可能后续还能吃
      // 但必须回到更后面的巧克力先吃
    }
  }

  // 第二轮：如果还有剩余，从上次位置之后继续
  // 实际上需要模拟循环，每天选择比前一天编号大的有剩余的巧克力
  return days;
}

// 方法2：贪心 - 计算总天数
// 每轮从左到右依次选择有剩余的巧克力各吃一格
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function chocolateDaysGreedy(chocolates: number[]): number {
  chocolates.sort((a, b) => a - b);
  let days = 0;

  // 模拟逐轮消耗
  let hasRemaining = true;
  while (hasRemaining) {
    hasRemaining = false;
    for (let i = 0; i < chocolates.length; i++) {
      if (chocolates[i] > 0) {
        chocolates[i]--;
        days++;
        hasRemaining = true;
      }
    }
  }
  return days;
}

// ============================================================
// 12. 美团 - 平均数为k的最长连续子数组
// 给定一个正整数数组nums和整数k，求最长的连续子数组，
// 使得该子数组的平均数等于k。返回其长度，不存在则返回0。
// ============================================================

// 方法：前缀和 + 哈希表
// 若 nums[i..j] 的平均数为 k，则 sum[i..j] = k * (j - i + 1)
// 即 prefixSum[j+1] - prefixSum[i] = k * (j - i + 1)
// 变形：prefixSum[j+1] - k*(j+1) = prefixSum[i] - k*i
// 令 diff[i] = prefixSum[i] - k*i，找最远相等的 diff 值
// 时间复杂度 O(n)，空间复杂度 O(n)
function longestSubarrayWithAvgK(nums: number[], k: number): number {
  const n = nums.length;
  const diffIndex = new Map<number, number>(); // diff值 -> 最早出现的位置
  diffIndex.set(0, 0); // diff[0] = 0

  let prefixSum = 0;
  let maxLen = 0;

  for (let i = 1; i <= n; i++) {
    prefixSum += nums[i - 1];
    const diff = prefixSum - k * i;

    if (diffIndex.has(diff)) {
      // 找到最早出现相同 diff 的位置，计算子数组长度
      const len = i - diffIndex.get(diff)!;
      maxLen = Math.max(maxLen, len);
    } else {
      // 首次出现，记录位置
      diffIndex.set(diff, i);
    }
  }

  return maxLen;
}

// ============================================================
// 13. 米哈游 - 米小游的极差之和
// 给定一个长度为n的数组a，定义子数组a[l..r]的极差为
// max(a[l..r]) - min(a[l..r])。求所有子数组的极差之和。
// ============================================================

// 方法：单调栈分别求所有子数组最大值之和与最小值之和
// 时间复杂度 O(n)，空间复杂度 O(n)
function rangeSum(nums: number[]): number {
  const n = nums.length;

  // 计算每个元素作为最大值贡献的子数组个数
  function sumOfMax(arr: number[]): number {
    const n = arr.length;
    // left[i]: 左边第一个大于 arr[i] 的位置
    const left = new Array(n).fill(-1);
    // right[i]: 右边第一个大于等于 arr[i] 的位置（避免重复计数）
    const right = new Array(n).fill(n);

    const stack: number[] = [];
    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] <= arr[i]) {
        right[stack.pop()!] = i;
      }
      if (stack.length > 0) left[i] = stack[stack.length - 1];
      stack.push(i);
    }

    let total = 0;
    for (let i = 0; i < n; i++) {
      const count = (i - left[i]) * (right[i] - i);
      total += arr[i] * count;
    }
    return total;
  }

  // 计算每个元素作为最小值贡献的子数组个数
  function sumOfMin(arr: number[]): number {
    const n = arr.length;
    const left = new Array(n).fill(-1);
    const right = new Array(n).fill(n);

    const stack: number[] = [];
    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
        right[stack.pop()!] = i;
      }
      if (stack.length > 0) left[i] = stack[stack.length - 1];
      stack.push(i);
    }

    let total = 0;
    for (let i = 0; i < n; i++) {
      const count = (i - left[i]) * (right[i] - i);
      total += arr[i] * count;
    }
    return total;
  }

  return sumOfMax(nums) - sumOfMin(nums);
}

// ============================================================
// 14. 美团 - 小美的蛋糕切割
// 小美有一块 n × m 的蛋糕，蛋糕上每个格子有不同数量的草莓。
// 她想在水平和垂直方向各切一刀，将蛋糕分成4块。
// 求4块蛋糕草莓数的最大值与最小值之差的最小值。
// ============================================================

// 方法：前缀和 + 枚举切割位置
// 时间复杂度 O(n * m + n * m)，空间复杂度 O(n * m)
function cakeCutting(cake: number[][]): number {
  const n = cake.length;
  const m = cake[0].length;

  // 计算二维前缀和
  const prefix = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      prefix[i][j] =
        cake[i - 1][j - 1] +
        prefix[i - 1][j] +
        prefix[i][j - 1] -
        prefix[i - 1][j - 1];
    }
  }

  // 求 (r1,c1) 到 (r2,c2) 的子矩阵和
  function regionSum(r1: number, c1: number, r2: number, c2: number): number {
    return (
      prefix[r2][c2] -
      prefix[r1][c2] -
      prefix[r2][c1] +
      prefix[r1][c1]
    );
  }

  let minDiff = Infinity;

  // 枚举水平切割线（在第 i 行之后切）和垂直切割线（在第 j 列之后切）
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      // 四块区域
      const topLeft = regionSum(0, 0, i, j);
      const topRight = regionSum(0, j, i, m);
      const bottomLeft = regionSum(i, 0, n, j);
      const bottomRight = regionSum(i, j, n, m);

      const maxVal = Math.max(topLeft, topRight, bottomLeft, bottomRight);
      const minVal = Math.min(topLeft, topRight, bottomLeft, bottomRight);
      minDiff = Math.min(minDiff, maxVal - minVal);
    }
  }

  return minDiff;
}

// ============================================================
// 15. 美团 - 小美的游戏
// 有n堆石子，第i堆有a[i]个。每次操作可以将两堆石子合并，
// 合并的代价为两堆石子数之和。求将所有石子合并为一堆的
// 最小总代价。（等价于哈夫曼编码 / LeetCode 合并石子的最低成本）
// ============================================================

// 方法：小根堆贪心
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function mergeStonesGame(stones: number[]): number {
  if (stones.length <= 1) return 0;

  // 使用数组模拟小根堆
  const heap = [...stones];
  heap.sort((a, b) => a - b);

  let totalCost = 0;

  while (heap.length > 1) {
    // 取出最小的两堆
    const a = heap.shift()!;
    const b = heap.shift()!;
    const cost = a + b;
    totalCost += cost;

    // 将合并后的堆插入到正确位置（保持有序）
    let insertIdx = 0;
    while (insertIdx < heap.length && heap[insertIdx] < cost) {
      insertIdx++;
    }
    heap.splice(insertIdx, 0, cost);
  }

  return totalCost;
}

// ============================================================
// 16. 字节跳动 - 字符串相加
// 给定两个仅由数字构成的字符串 num1 和 num2，不使用 Integer
// 的 parseInt 方法，返回它们相加的结果，用字符串表示。
// （LeetCode 415. Add Strings）
// ============================================================

// 方法：模拟竖式加法
// 时间复杂度 O(max(len1, len2))，空间复杂度 O(max(len1, len2))
function addStrings(num1: string, num2: string): string {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const result: string[] = [];

  // 从最低位开始逐位相加
  while (i >= 0 || j >= 0 || carry > 0) {
    // 获取当前位的数字（利用字符编码差值，不用 parseInt）
    const digit1 = i >= 0 ? num1.charCodeAt(i) - "0".charCodeAt(0) : 0;
    const digit2 = j >= 0 ? num2.charCodeAt(j) - "0".charCodeAt(0) : 0;

    const sum = digit1 + digit2 + carry;
    carry = Math.floor(sum / 10);
    result.push(String.fromCharCode((sum % 10) + "0".charCodeAt(0)));

    i--;
    j--;
  }

  // 结果是逆序的，翻转后返回
  return result.reverse().join("");
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 小米 - 手机通信校准 =====");
console.log(phoneCalibration([1, 2, 3, 4], [1, 2, 3])); // 1（需增加4）
console.log(phoneCalibration([1, 2, 3], [1, 2, 2, 3])); // 1（需删除多余的2）
console.log(phoneCalibration([1, 2, 3], [4, 5, 6])); // 6（3个删除+3个增加）

console.log("\n===== 2. 小米 - 精华帖子 =====");
console.log(
  featuredPosts([
    { reads: 100, likes: 60 },
    { reads: 100, likes: 40 },
    { reads: 100, likes: 55 },
  ])
); // 2（60 > 50, 40 <= 50, 55 > 50）

console.log("\n===== 3. 小米 - 最高的楼 =====");
console.log(
  tallestBuildingDiff([1, 2, 3, 4, 5], [
    [0, 2],
    [1, 3],
  ])
); // 5（楼0-2各+1，楼1-3各+1，最终[2,4,5,5,5]）
console.log(
  tallestBuildingBrute([1, 2, 3, 4, 5], [
    [0, 2],
    [1, 3],
  ])
); // 5

console.log("\n===== 4. 小米 - 手机流畅运行的秘密 =====");
console.log(phoneSmooth([4, 3, 2, 1, 5], 8)); // 2（总15，需释放7，关闭5+4=9>=7）
console.log(phoneSmooth([1, 2, 3], 10)); // 0（总6<=10，无需关闭）

console.log("\n===== 5. 小米 - 讨厌鬼的组合帖子 =====");
console.log(combinedPosts([1, 2, 3, 1])); // 4（选第1、3篇：1+3=4）
console.log(combinedPosts([2, 7, 9, 3, 1])); // 12（选2+9+1=12）
console.log(combinedPostsDP([2, 7, 9, 3, 1])); // 12

console.log("\n===== 6. 美团 - 小美的数组重排 =====");
console.log(arrayRearrange([1, 2, 3])); // 如 [2,3,1] 或 [3,1,2] 等错排
console.log(arrayRearrange([1, 1, 2])); // null（1出现2次，n=3，2>1.5，无法错排）

console.log("\n===== 7. 小米 - 矩形田地 =====");
console.log(maxFarmland(3, 4, [[1, 2]])); // 4（第0行和第2行各有4格连续无障碍）
console.log(maxFarmland(2, 3, [])); // 6（全部无障碍）

console.log("\n===== 8. 小米 - 删点成林 =====");
const tree8 = createTree([1, 2, 3, 4, 5, 6, 7]);
const forest8 = deleteNodesForest(tree8, [3, 5]);
console.log(forest8.map((t) => t.val)); // [1, 6, 7]（删除3和5后的森林根节点）

console.log("\n===== 9. 小米 - 迷宫 =====");
console.log(
  mazeShortestPath([
    [0, 0, 0],
    [1, 0, 1],
    [0, 0, 0],
  ])
); // 4（(0,0)->(0,1)->(1,1)->(2,1)->(2,2)）
console.log(
  mazeShortestPath([
    [0, 1],
    [1, 0],
  ])
); // -1（无法到达）

console.log("\n===== 10. 小米 - 攀比 =====");
console.log(comparisonValue([60, 70, 80, 90])); // [70, 80, 90, -1]
console.log(comparisonValue([100, 100, 100])); // [-1, -1, -1]

console.log("\n===== 11. 小米 - 巧克力 =====");
console.log(chocolateDaysGreedy([2, 3, 1])); // 6（每轮从左到右各吃一格）
console.log(chocolateDaysGreedy([1, 1, 1])); // 3

console.log("\n===== 12. 美团 - 平均数为k的最长连续子数组 =====");
console.log(longestSubarrayWithAvgK([1, 3, 2, 4, 5], 3)); // 5（[1,3,2,4,5]平均数为3）
console.log(longestSubarrayWithAvgK([1, 2, 3], 2)); // 3（[1,2,3] 平均数为2）

console.log("\n===== 13. 米哈游 - 米小游的极差之和 =====");
console.log(rangeSum([1, 3, 2])); // 5（子数组极差：[1]=0,[3]=0,[2]=0,[1,3]=2,[3,2]=1,[1,3,2]=2，总和=5）
console.log(rangeSum([3, 1, 2])); // 同理

console.log("\n===== 14. 美团 - 小美的蛋糕切割 =====");
console.log(
  cakeCutting([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ])
); // 枚举所有切割位置，找最小差值

console.log("\n===== 15. 美团 - 小美的游戏 =====");
console.log(mergeStonesGame([1, 2, 3, 4])); // 19（1+2=3, 3+3=6, 4+6=10, 总3+6+10=19）
console.log(mergeStonesGame([3, 2, 4, 1])); // 19

console.log("\n===== 16. 字节跳动 - 字符串相加 =====");
console.log(addStrings("123", "456")); // "579"
console.log(addStrings("999", "1")); // "1000"
console.log(addStrings("0", "0")); // "0"

export {};
