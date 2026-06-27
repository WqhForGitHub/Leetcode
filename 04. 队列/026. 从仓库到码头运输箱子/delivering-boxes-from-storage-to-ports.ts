// ============================================================
// 026. 从仓库到码头运输箱子
// ============================================================
// LeetCode 1687. Delivering Boxes from Storage to Ports
// 需要将箱子按顺序从仓库运到码头，每次最多运 maxBoxes 个且总重不超过 maxWeight。
// 返回最少需要多少趟运输。每趟需要从当前码头返回仓库。

// ------------------------------------------------------------
// 方法1：动态规划 + 单调队列优化
// ------------------------------------------------------------
// dp[i] = 运送前 i 个箱子的最小行程数。
// dp[i] = min(dp[j] + cost(j+1, i) + 2)，其中 cost 为该段不同码头数-1。
// 用单调队列优化转移。
// 时间 O(n)，空间 O(n)。
function boxDelivering1(
  boxes: number[][],
  portsCount: number,
  maxBoxes: number,
  maxWeight: number,
): number {
  const n = boxes.length;
  // 前缀重量和
  const weightPrefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    weightPrefix[i + 1] = weightPrefix[i] + boxes[i][1];
  }
  // diff[i] = boxes[i] 和 boxes[i-1] 是否不同码头
  const diff: number[] = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    diff[i] = boxes[i][0] !== boxes[i - 1][0] ? 1 : 0;
  }
  // diffPrefix[i] = sum(diff[1..i])
  const diffPrefix: number[] = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    diffPrefix[i] = diffPrefix[i - 1] + (i < n ? diff[i] : 0);
  }

  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 0;
  // 单调队列存储下标 j，按 dp[j] - diffPrefix[j] 单调递增
  const deque: number[] = [0];

  for (let i = 1; i <= n; i++) {
    // 移除超出约束的队首
    while (deque.length > 0) {
      const j = deque[0];
      const boxesCount = i - j;
      const totalWeight = weightPrefix[i] - weightPrefix[j];
      if (boxesCount > maxBoxes || totalWeight > maxWeight) {
        deque.shift();
      } else {
        break;
      }
    }
    if (deque.length > 0) {
      const j = deque[0];
      const trips = 2 + (diffPrefix[i - 1] - (j + 1 < n ? diffPrefix[j] : 0));
      dp[i] = dp[j] + trips;
    } else {
      dp[i] = Infinity;
    }
    // 入队，保持单调
    const val = dp[i] - diffPrefix[i];
    while (deque.length > 0) {
      const tail = deque[deque.length - 1];
      const tailVal = dp[tail] - diffPrefix[tail];
      if (tailVal >= val) {
        deque.pop();
      } else {
        break;
      }
    }
    deque.push(i);
  }
  return dp[n];
}

// ------------------------------------------------------------
// 方法2：动态规划（朴素）
// ------------------------------------------------------------
// 不使用单调队列优化，直接枚举 j。
// 时间 O(n * maxBoxes)，空间 O(n)。
function boxDelivering2(
  boxes: number[][],
  portsCount: number,
  maxBoxes: number,
  maxWeight: number,
): number {
  const n = boxes.length;
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    let totalWeight = 0;
    let trips = 2;
    for (let j = i - 1; j >= 0 && i - j <= maxBoxes; j--) {
      totalWeight += boxes[j][1];
      if (totalWeight > maxWeight) break;
      if (j < i - 1 && boxes[j][0] !== boxes[j + 1][0]) {
        trips++;
      }
      dp[i] = Math.min(dp[i], dp[j] + trips);
    }
  }
  return dp[n];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    boxDelivering1(
      [
        [1, 1],
        [2, 1],
        [1, 1],
      ],
      2,
      3,
      3,
    ),
    "期望: 6",
  );
  console.log(
    "测试2:",
    boxDelivering1(
      [
        [1, 2],
        [3, 3],
        [3, 1],
        [3, 1],
        [2, 4],
      ],
      3,
      3,
      6,
    ),
    "期望: 6",
  );
  console.log(
    "测试3:",
    boxDelivering2(
      [
        [1, 1],
        [2, 1],
        [1, 1],
      ],
      2,
      3,
      3,
    ),
    "期望: 6",
  );
}

test();

export {};
