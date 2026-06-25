// ============================================================
// 大厂算法真题 - TypeScript 解题合集（二）
// ============================================================

// ============================================================
// 1. 大疆2023秋招 - 链表合并
// 合并K个升序链表
// LeetCode 23. Merge k Sorted Lists
// ============================================================

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转链表
function createList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const val of arr) {
    cur.next = new ListNode(val);
    cur = cur.next;
  }
  return dummy.next;
}

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

// 方法1：分治法（推荐）
// 时间复杂度 O(n log k)，空间复杂度 O(log k)
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  return merge(lists, 0, lists.length - 1);
}

function merge(
  lists: Array<ListNode | null>,
  lo: number,
  hi: number,
): ListNode | null {
  if (lo === hi) return lists[lo];
  const mid = Math.floor((lo + hi) / 2);
  const left = merge(lists, lo, mid);
  const right = merge(lists, mid + 1, hi);
  return mergeTwoLists(left, right);
}

function mergeTwoLists(
  a: ListNode | null,
  b: ListNode | null,
): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      cur.next = a;
      a = a.next;
    } else {
      cur.next = b;
      b = b.next;
    }
    cur = cur.next;
  }
  cur.next = a || b;
  return dummy.next;
}

// 方法2：最小堆法
// 时间复杂度 O(n log k)，空间复杂度 O(k)
function mergeKListsHeap(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;

  const heap: ListNode[] = [];

  function heapPush(node: ListNode): void {
    heap.push(node);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent].val <= heap[i].val) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  function heapPop(): ListNode | undefined {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < heap.length && heap[left].val < heap[smallest].val)
          smallest = left;
        if (right < heap.length && heap[right].val < heap[smallest].val)
          smallest = right;
        if (smallest === i) break;
        [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
        i = smallest;
      }
    }
    return top;
  }

  for (const list of lists) {
    if (list) heapPush(list);
  }

  const dummy = new ListNode(0);
  let cur = dummy;
  while (heap.length > 0) {
    const node = heapPop()!;
    cur.next = node;
    cur = cur.next;
    if (node.next) heapPush(node.next);
  }

  return dummy.next;
}

// ============================================================
// 2. 华为2023暑期实习 - 空栈压数
// 向空栈中依次压入数字，若栈顶元素等于待压入的数，
// 则弹出栈顶并压入两数之和，重复直到栈顶不等于待压入的数
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function emptyStackPush(nums: number[]): number[] {
  const stack: number[] = [];

  for (const num of nums) {
    let val = num;
    // 栈顶等于待压入的数时，合并
    while (stack.length > 0 && stack[stack.length - 1] === val) {
      val = stack.pop()! + val;
    }
    stack.push(val);
  }

  return stack;
}

// ============================================================
// 3. Bilibili2021秋招 - 大鱼吃小鱼
// 每条鱼有大小和方向（0=向左，1=向右），方向相同不会相遇
// 方向相反的鱼相遇时，大鱼吃小鱼；大小相同则同归于尽
// 求最后剩下的鱼的数量
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function fishEating(sizes: number[], directions: number[]): number {
  const n = sizes.length;
  const stack: number[] = []; // 存储向右游的鱼的索引
  let survived = 0;

  for (let i = 0; i < n; i++) {
    if (directions[i] === 1) {
      // 向右游的鱼入栈，等待与后续向左游的鱼相遇
      stack.push(i);
    } else {
      // 向左游的鱼，与栈中向右游的鱼依次战斗
      let alive = true;
      while (stack.length > 0 && alive) {
        const top = stack[stack.length - 1];
        if (sizes[top] < sizes[i]) {
          stack.pop(); // 栈顶右游鱼被吃
        } else if (sizes[top] === sizes[i]) {
          stack.pop(); // 同归于尽
          alive = false;
        } else {
          alive = false; // 当前左游鱼被吃
        }
      }
      if (alive) survived++; // 左游鱼存活
    }
  }

  survived += stack.length; // 栈中剩余右游鱼全部存活
  return survived;
}

// ============================================================
// 4. 荣耀2023秋招 - 算式求解
// 给定一个包含 +、-、*、/ 和括号的算式字符串，求其值
// LeetCode 224/227 变种
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function evaluateExpression(s: string): number {
  const nums: number[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

  function applyOp(): void {
    const b = nums.pop()!;
    const a = nums.pop()!;
    const op = ops.pop()!;
    switch (op) {
      case "+":
        nums.push(a + b);
        break;
      case "-":
        nums.push(a - b);
        break;
      case "*":
        nums.push(a * b);
        break;
      case "/":
        nums.push(Math.trunc(a / b));
        break;
    }
  }

  let i = 0;
  while (i < s.length) {
    const ch = s[i];

    if (ch === " ") {
      i++;
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      let num = 0;
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        num = num * 10 + parseInt(s[i]);
        i++;
      }
      nums.push(num);
      continue;
    }

    if (ch === "(") {
      ops.push(ch);
    } else if (ch === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") applyOp();
      ops.pop(); // 弹出 "("
    } else {
      // 处理一元负号：表达式开头或左括号后的负号
      if (ch === "-" && (nums.length === 0 || (i > 0 && s[i - 1] === "("))) {
        nums.push(0);
      }
      // 当前运算符优先级 <= 栈顶时，先计算栈顶
      while (
        ops.length > 0 &&
        ops[ops.length - 1] !== "(" &&
        precedence[ops[ops.length - 1]] >= precedence[ch]
      ) {
        applyOp();
      }
      ops.push(ch);
    }
    i++;
  }

  while (ops.length > 0) applyOp();
  return nums[0];
}

// ============================================================
// 5. 百度2017秋招 - 士兵队列
// N 个士兵编号 1~N 站成一排
// 第一次从左到右 1~2 报数，报2的出列
// 第二次从右到左 1~2~3 报数，报3的出列
// 重复直到人数 <= 3
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function soldierQueue(n: number): number[] {
  if (n <= 3) return Array.from({ length: n }, (_, i) => i + 1);

  let soldiers = Array.from({ length: n }, (_, i) => i + 1);
  let round = 0;

  while (soldiers.length > 3) {
    const next: number[] = [];

    if (round % 2 === 0) {
      // 从左到右 1~2 报数，报2的出列（保留奇数位置，0-indexed 偶数位置）
      for (let i = 0; i < soldiers.length; i++) {
        if (i % 2 === 0) next.push(soldiers[i]);
      }
    } else {
      // 从右到左 1~2~3 报数，报3的出列
      for (let i = soldiers.length - 1; i >= 0; i--) {
        const pos = soldiers.length - 1 - i; // 从右往左的位置（0-indexed）
        if (pos % 3 !== 2) next.push(soldiers[i]); // 保留报1、2的
      }
      next.reverse(); // 恢复从左到右的顺序
    }

    soldiers = next;
    round++;
  }

  return soldiers;
}

// ============================================================
// 6. 腾讯2020春招 - 压缩算法
// 给定压缩字符串，如 "a2[b3[c]]d" → "abcccbcccd"
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function decompress(s: string): string {
  const stack: string[] = []; // 交替存储前缀字符串和重复次数
  let num = 0;
  let result = "";

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= "0" && ch <= "9") {
      num = num * 10 + parseInt(ch);
    } else if (ch === "[") {
      // 将当前结果和重复次数入栈
      stack.push(result);
      stack.push(String(num));
      result = "";
      num = 0;
    } else if (ch === "]") {
      // 弹出重复次数和前缀，拼接结果
      const repeat = parseInt(stack.pop()!);
      const prefix = stack.pop()!;
      result = prefix + result.repeat(repeat);
    } else {
      result += ch;
    }
  }

  return result;
}

// ============================================================
// 7. 华为2023秋招 - 每日股票价格
// 给定每日股票价格，对于每一天，求之后第一个比当天价格高的日期距离当前的天数
// 若不存在则输出 0
// LeetCode 739. Daily Temperatures
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function dailyStockPrices(prices: number[]): number[] {
  const n = prices.length;
  const result = new Array(n).fill(0);
  const stack: number[] = []; // 单调递减栈，存储索引

  for (let i = 0; i < n; i++) {
    // 当前价格比栈顶价格高时，栈顶元素找到了下一个更高价格
    while (stack.length > 0 && prices[stack[stack.length - 1]] < prices[i]) {
      const idx = stack.pop()!;
      result[idx] = i - idx;
    }
    stack.push(i);
  }

  return result;
}

// ============================================================
// 8. 美团2023春招 - 火车迷
// 给定火车进站序列和出站序列，判断出站序列是否合法
// 经典栈模拟问题
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function validTrainOrder(inOrder: number[], outOrder: number[]): boolean {
  const stack: number[] = [];
  let outIdx = 0;

  for (const train of inOrder) {
    stack.push(train);
    // 栈顶与出站序列当前元素匹配时，持续弹出
    while (stack.length > 0 && stack[stack.length - 1] === outOrder[outIdx]) {
      stack.pop();
      outIdx++;
    }
  }

  return outIdx === outOrder.length;
}

// ============================================================
// 9. 腾讯2021秋招 & 用友2022秋招 - 逛街
// 给定一组建筑高度，对于每个位置，求从该位置能看到多少栋建筑
// 比当前高或等高的建筑会遮挡后面的建筑
// 使用单调栈分别计算向左和向右能看到的建筑数
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function shoppingView(heights: number[]): number[] {
  const n = heights.length;
  const leftVisible = new Array(n).fill(0);
  const rightVisible = new Array(n).fill(0);

  // 从左到右：用单调递减栈计算向左能看到的建筑数
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    leftVisible[i] = stack.length; // 栈中元素都是向左可见的
    while (stack.length > 0 && stack[stack.length - 1] <= heights[i]) {
      stack.pop(); // 被当前建筑遮挡
    }
    stack.push(heights[i]);
  }

  // 从右到左：用单调递减栈计算向右能看到的建筑数
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    rightVisible[i] = stack.length;
    while (stack.length > 0 && stack[stack.length - 1] <= heights[i]) {
      stack.pop();
    }
    stack.push(heights[i]);
  }

  return heights.map((_, i) => leftVisible[i] + rightVisible[i]);
}

// ============================================================
// 10. 米哈游2023秋招 - 米小游与魔法少女-奇运
// n 张卡牌排成一排，第 i 张卡牌幸运值为 a_i
// 选择若干张卡牌使得幸运值之和最大，且任意两张被选中的卡牌不相邻
// LeetCode 198. House Robber
// 时间复杂度 O(n)，空间复杂度 O(1)
// ============================================================

function magicGirlLuck(cards: number[]): number {
  if (cards.length === 0) return 0;
  if (cards.length === 1) return cards[0];

  let prev2 = 0; // dp[i-2]
  let prev1 = 0; // dp[i-1]

  for (const val of cards) {
    const cur = Math.max(prev1, prev2 + val); // 不选 / 选
    prev2 = prev1;
    prev1 = cur;
  }

  return prev1;
}

// ============================================================
// 11. 华为2023秋招 - 开电动汽车回家过年
// 给定充电站位置数组、电动车续航里程、目的地距离
// 求到达目的地的最少充电次数，若无法到达返回 -1
// 类似 Jump Game II
// 时间复杂度 O(n)，空间复杂度 O(1)
// ============================================================

function evChargeHome(
  stations: number[],
  maxRange: number,
  target: number,
): number {
  // 将起点、充电站、终点统一处理
  const positions = [0, ...stations, target];
  const n = positions.length;
  let count = 0;
  let currentEnd = maxRange; // 当前不充电能到达的最远位置
  let nextEnd = maxRange; // 充一次电后能到达的最远位置

  for (let i = 1; i < n; i++) {
    if (positions[i] > nextEnd) {
      return -1; // 即使充电也无法到达
    }

    if (positions[i] > currentEnd) {
      count++; // 必须在之前经过的充电站充电
      currentEnd = nextEnd;
    }

    // 如果在当前充电站充电，能到达的最远距离
    if (i < n - 1) {
      nextEnd = Math.max(nextEnd, positions[i] + maxRange);
    }
  }

  return count;
}

// ============================================================
// 12. 科大讯飞非凡计划 - 小红的区间翻转
// 给定一个 01 数组和翻转区间长度 k，每次翻转连续 k 个元素（0↔1）
// 求最少翻转次数使数组全为 1，若不可能返回 -1
// LeetCode 995. Minimum Number of K Consecutive Bit Flips
// 时间复杂度 O(n)，空间复杂度 O(n)
// ============================================================

function intervalFlip(nums: number[], k: number): number {
  const n = nums.length;
  const flipDiff = new Array(n + 1).fill(0); // 差分数组标记翻转区间
  let flipCount = 0; // 当前位置受到的有效翻转次数
  let result = 0;

  for (let i = 0; i < n; i++) {
    flipCount += flipDiff[i]; // 累加翻转标记

    // 当前位置的实际值 = (原始值 + 翻转次数) % 2
    // 如果结果为 0，则需要翻转
    if ((nums[i] + flipCount) % 2 === 0) {
      if (i + k > n) return -1; // 剩余元素不足 k 个
      flipCount++; // 翻转次数 +1
      flipDiff[i + k]--; // 差分标记：i+k 位置翻转结束
      result++;
    }
  }

  return result;
}

// ============================================================
// 13. 字节跳动2023秋招 - 小红的 01 串
// 给定一个 01 串，每次可以翻转一个连续子串（0↔1）
// 求最少操作次数使 01 串变为全 0 或全 1
// 思路：变全0需翻转所有"1块"，变全1需翻转所有"0块"
// 时间复杂度 O(n)，空间复杂度 O(1)
// ============================================================

function zeroOneString(s: string): number {
  if (s.length === 0) return 0;

  let count0 = 0; // 连续 0 块的数量
  let count1 = 0; // 连续 1 块的数量

  for (let i = 0; i < s.length; i++) {
    // 统计每个连续块的起始
    if (i === 0 || s[i] !== s[i - 1]) {
      if (s[i] === "0") count0++;
      else count1++;
    }
  }

  return Math.min(count0, count1);
}

// ============================================================
// 14. 得物2023秋招 - Cheems的漂亮糖葫芦
// 给定糖葫芦上糖的颜色序列，求最长的"漂亮"子序列长度
// 漂亮定义：子序列中相邻两个糖颜色不同
// 思路：从每个连续颜色块中各取一个，即为最长漂亮子序列
// 时间复杂度 O(n)，空间复杂度 O(1)
// ============================================================

function beautifulCandiedHaws(colors: string): number {
  if (colors.length === 0) return 0;

  let count = 1; // 第一个字符一定属于漂亮子序列
  for (let i = 1; i < colors.length; i++) {
    if (colors[i] !== colors[i - 1]) {
      count++; // 颜色变化处，可以加入子序列
    }
  }

  return count;
}

// ============================================================
// 15. 华为2023秋招 - PCB印刷电路板布线
// 给定多个连接点对 (a_i, b_i)，求最多能同时布多少条不交叉的线
// 等价于：按 a 排序后求 b 的最长递增子序列 (LIS)
// 时间复杂度 O(n log n)，空间复杂度 O(n)
// ============================================================

function pcbRouting(connections: [number, number][]): number {
  if (connections.length === 0) return 0;

  // 按 a 坐标排序
  connections.sort((a, b) => a[0] - b[0]);

  // 贪心 + 二分求 b 坐标的 LIS
  const tails: number[] = []; // tails[i] = 长度为 i+1 的 LIS 的最小末尾元素

  for (const [, b] of connections) {
    let lo = 0,
      hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] < b) lo = mid + 1;
      else hi = mid;
    }

    if (lo === tails.length) tails.push(b);
    else tails[lo] = b;
  }

  return tails.length;
}

// ============================================================
// 16. Shein2023秋招提前批 - 零钱兑换
// 给定不同面额的硬币 coins 和一个总金额 amount
// 求凑成总金额所需的最少硬币数，若无法凑成返回 -1
// LeetCode 322. Coin Change
// 时间复杂度 O(amount * n)，空间复杂度 O(amount)
// ============================================================

function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ============================================================
// 17. OPPO2023秋招提前批 - 小欧的卡牌
// 给定一组卡牌，每张卡牌有一个数字，从中选出若干张
// 使得选出的卡牌数字之和为某个目标值，求方案数
// 0-1 背包求方案数
// 时间复杂度 O(n * target)，空间复杂度 O(target)
// ============================================================

function cardGame(cards: number[], target: number): number {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // 凑出和为 0 的方案数：不选任何卡牌

  for (const card of cards) {
    // 从大到小遍历，保证每张卡牌只使用一次
    for (let j = target; j >= card; j--) {
      dp[j] += dp[j - card];
    }
  }

  return dp[target];
}

// ============================================================
// 18. 华为2023秋招 - 中庸行者
// 给定一个矩阵，从左上角走到右下角，每次只能向右或向下
// 求路径上数字的中位数的最大值
// 思路：二分答案 + DP 判定
// 时间复杂度 O(m * n * log(max - min))，空间复杂度 O(m * n)
// ============================================================

function middleWalker(matrix: number[][]): number {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const pathLen = rows + cols - 1;
  const need = Math.ceil(pathLen / 2); // 中位数要求至少 need 个元素 >= mid

  // 收集所有可能的值用于二分
  const allVals = new Set<number>();
  for (const row of matrix) for (const v of row) allVals.add(v);
  const sorted = [...allVals].sort((a, b) => a - b);

  let lo = 0,
    hi = sorted.length - 1;
  let ans = sorted[0];

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const threshold = sorted[mid];

    // DP: 求路径上 >= threshold 的元素的最大个数
    const dp = Array.from({ length: rows }, () =>
      new Array(cols).fill(-Infinity),
    );

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const val = matrix[i][j] >= threshold ? 1 : 0;
        if (i === 0 && j === 0) {
          dp[i][j] = val;
        } else if (i === 0) {
          dp[i][j] = dp[i][j - 1] + val;
        } else if (j === 0) {
          dp[i][j] = dp[i - 1][j] + val;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]) + val;
        }
      }
    }

    if (dp[rows - 1][cols - 1] >= need) {
      ans = threshold; // threshold 可作为中位数，尝试更大值
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return ans;
}

// ============================================================
// 19. 米哈游2023秋招 - 相加异或
// 给定一个整数 n，求满足 a + b = a ^ b 的正整数对 (a, b) 的数量
// 其中 1 <= a <= b <= n
// 等价于 a & b = 0（无进位加法），使用数位 DP
// 时间复杂度 O(log n)，空间复杂度 O(log n)
// ============================================================

function addXor(n: number): number {
  const bits = n.toString(2).split("").map(Number);
  const len = bits.length;
  const memo = new Map<string, number>();

  // 数位 DP：从高位到低位逐位分配
  // pos: 当前位, limitA/limitB: 是否受 n 约束
  // cmp: 0=a与b前缀相等, 1=a<b
  // aZero/bZero: a/b 是否全为 0
  function dp(
    pos: number,
    limitA: number,
    limitB: number,
    cmp: number,
    aZero: number,
    bZero: number,
  ): number {
    if (pos === len) {
      // a >= 1 且 b >= 1 且 a < b（a=b 且 a&b=0 要求 a=0，与 a>=1 矛盾）
      if (aZero || bZero) return 0;
      return cmp === 1 ? 1 : 0;
    }

    const key = `${pos},${limitA},${limitB},${cmp},${aZero},${bZero}`;
    if (memo.has(key)) return memo.get(key)!;

    let result = 0;
    const maxA = limitA ? bits[pos] : 1;
    const maxB = limitB ? bits[pos] : 1;

    for (let abit = 0; abit <= maxA; abit++) {
      for (let bbit = 0; bbit <= maxB; bbit++) {
        if (abit & bbit) continue; // a & b = 0

        let newCmp = cmp;
        if (cmp === 0) {
          if (abit < bbit) newCmp = 1;
          else if (abit > bbit) continue; // a > b，不合法
        }

        result += dp(
          pos + 1,
          limitA && abit === bits[pos] ? 1 : 0,
          limitB && bbit === bits[pos] ? 1 : 0,
          newCmp,
          aZero && abit === 0 ? 1 : 0,
          bZero && bbit === 0 ? 1 : 0,
        );
      }
    }

    memo.set(key, result);
    return result;
  }

  return dp(0, 1, 1, 0, 1, 1);
}

// ============================================================
// 20. 百度2023秋招 - 小红的第16版方案
// 给定一个字符串，每次可以删除一个字符或在任意位置插入一个字符
// 求最少操作次数使字符串变为回文串
// 等价于：n - 最长回文子序列长度
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
// ============================================================

function xiaohongPlan16(s: string): number {
  const n = s.length;
  if (n <= 1) return 0;

  // dp[i][j] = s[i..j] 中最长回文子序列的长度
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // 单个字符本身就是长度为 1 的回文子序列
  for (let i = 0; i < n; i++) dp[i][i] = 1;

  // 从短到长枚举子串长度
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  // 最少操作次数 = 字符串长度 - 最长回文子序列长度
  return n - dp[0][n - 1];
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 大疆2023秋招 - 链表合并 =====");
const l1 = createList([1, 4, 5]);
const l2 = createList([1, 3, 4]);
const l3 = createList([2, 6]);
console.log(listToArray(mergeKLists([l1, l2, l3]))); // [1, 1, 2, 3, 4, 4, 5, 6]
const l4 = createList([1, 4, 5]);
const l5 = createList([1, 3, 4]);
const l6 = createList([2, 6]);
console.log(listToArray(mergeKListsHeap([l4, l5, l6]))); // [1, 1, 2, 3, 4, 4, 5, 6]

console.log("\n===== 2. 华为2023暑期实习 - 空栈压数 =====");
console.log(emptyStackPush([1, 2, 2, 4])); // [1, 8]
console.log(emptyStackPush([4, 4, 8, 8])); // [16, 8]
console.log(emptyStackPush([1, 1])); // [2]

console.log("\n===== 3. Bilibili2021秋招 - 大鱼吃小鱼 =====");
console.log(fishEating([4, 3, 2, 1, 5], [0, 1, 0, 0, 0])); // 2
console.log(fishEating([4, 3, 2, 1, 5], [1, 1, 0, 0, 0])); // 1
console.log(fishEating([1, 2, 3, 4, 5], [1, 1, 1, 1, 1])); // 5

console.log("\n===== 4. 荣耀2023秋招 - 算式求解 =====");
console.log(evaluateExpression("2*(3+4)-6/2")); // 11
console.log(evaluateExpression("(1+2)*3")); // 9
console.log(evaluateExpression("3+2*2")); // 7
console.log(evaluateExpression(" 3/2 ")); // 1
console.log(evaluateExpression("-3+5")); // 2

console.log("\n===== 5. 百度2017秋招 - 士兵队列 =====");
console.log(soldierQueue(10)); // [1, 7]
console.log(soldierQueue(3)); // [1, 2, 3]
console.log(soldierQueue(20)); // [1, 13, 19]

console.log("\n===== 6. 腾讯2020春招 - 压缩算法 =====");
console.log(decompress("a2[b3[c]]d")); // abcccbcccd
console.log(decompress("3[a]2[bc]")); // aaabcbc
console.log(decompress("2[abc]3[cd]ef")); // abcabccdcdcdef

console.log("\n===== 7. 华为2023秋招 - 每日股票价格 =====");
console.log(dailyStockPrices([73, 74, 75, 71, 69, 72, 76, 73])); // [1,1,4,2,1,1,0,0]
console.log(dailyStockPrices([30, 40, 50, 60])); // [1,1,1,0]
console.log(dailyStockPrices([30, 60, 90])); // [1,1,0]

console.log("\n===== 8. 美团2023春招 - 火车迷 =====");
console.log(validTrainOrder([1, 2, 3], [3, 2, 1])); // true
console.log(validTrainOrder([1, 2, 3], [3, 1, 2])); // false
console.log(validTrainOrder([1, 2, 3], [1, 2, 3])); // true
console.log(validTrainOrder([1, 2, 3], [2, 1, 3])); // true

console.log("\n===== 9. 腾讯2021秋招 & 用友2022秋招 - 逛街 =====");
console.log(shoppingView([5, 4, 3, 2, 1])); // [1, 2, 3, 4, 4]
console.log(shoppingView([3, 1, 4, 2, 5])); // [3, 3, 4, 2, 2]
console.log(shoppingView([1, 2, 3, 4, 5])); // [4, 4, 3, 2, 1]

console.log("\n===== 10. 米哈游2023秋招 - 米小游与魔法少女-奇运 =====");
console.log(magicGirlLuck([1, 2, 3, 1])); // 4 (选 1+3)
console.log(magicGirlLuck([2, 7, 9, 3, 1])); // 12 (选 2+9+1)
console.log(magicGirlLuck([1])); // 1

console.log("\n===== 11. 华为2023秋招 - 开电动汽车回家过年 =====");
console.log(evChargeHome([1, 2, 5, 9, 15], 10, 20)); // 2
console.log(evChargeHome([5], 10, 15)); // 1
console.log(evChargeHome([], 10, 8)); // 0
console.log(evChargeHome([2, 4, 6, 8], 4, 10)); // 2

console.log("\n===== 12. 科大讯飞非凡计划 - 小红的区间翻转 =====");
console.log(intervalFlip([0, 0, 0, 1, 0, 1, 1, 0], 3)); // 3
console.log(intervalFlip([0, 1, 0], 1)); // 2
console.log(intervalFlip([1, 1, 0], 2)); // 1

console.log("\n===== 13. 字节跳动2023秋招 - 小红的 01 串 =====");
console.log(zeroOneString("01001")); // 2
console.log(zeroOneString("010")); // 1
console.log(zeroOneString("000")); // 0
console.log(zeroOneString("101")); // 1

console.log("\n===== 14. 得物2023秋招 - Cheems的漂亮糖葫芦 =====");
console.log(beautifulCandiedHaws("RRGBBR")); // 4
console.log(beautifulCandiedHaws("RGRGR")); // 5
console.log(beautifulCandiedHaws("RRR")); // 1
console.log(beautifulCandiedHaws("RGB")); // 3

console.log("\n===== 15. 华为2023秋招 - PCB印刷电路板布线 =====");
console.log(
  pcbRouting([
    [1, 2],
    [2, 3],
    [3, 1],
  ]),
); // 2
console.log(
  pcbRouting([
    [1, 3],
    [2, 2],
    [3, 1],
  ]),
); // 1
console.log(
  pcbRouting([
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1],
  ]),
); // 1

console.log("\n===== 16. Shein2023秋招提前批 - 零钱兑换 =====");
console.log(coinChange([1, 2, 5], 11)); // 3 (5+5+1)
console.log(coinChange([2], 3)); // -1
console.log(coinChange([1], 0)); // 0
console.log(coinChange([1, 2, 5], 100)); // 20

console.log("\n===== 17. OPPO2023秋招提前批 - 小欧的卡牌 =====");
console.log(cardGame([1, 2, 3], 3)); // 2 ({1,2} 和 {3})
console.log(cardGame([1, 1, 1], 2)); // 3 (任意两个1)
console.log(cardGame([1, 2, 3], 6)); // 1 ({1,2,3})

console.log("\n===== 18. 华为2023秋招 - 中庸行者 =====");
console.log(
  middleWalker([
    [1, 2],
    [3, 4],
  ]),
); // 3
console.log(
  middleWalker([
    [5, 1],
    [2, 8],
  ]),
); // 5
console.log(
  middleWalker([
    [1, 3, 2],
    [4, 5, 6],
  ]),
); // 5

console.log("\n===== 19. 米哈游2023秋招 - 相加异或 =====");
console.log(addXor(3)); // 1
console.log(addXor(5)); // 5
console.log(addXor(10)); // 19

console.log("\n===== 20. 百度2023秋招 - 小红的第16版方案 =====");
console.log(xiaohongPlan16("abca")); // 1 (删除b或插入b)
console.log(xiaohongPlan16("abcba")); // 0 (已是回文)
console.log(xiaohongPlan16("abc")); // 2
console.log(xiaohongPlan16("aabbaa")); // 0

export {};
