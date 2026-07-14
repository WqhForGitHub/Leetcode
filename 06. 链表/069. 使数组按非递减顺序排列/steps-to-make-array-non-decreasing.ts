// ============================================================
// 069. 使数组按非递减顺序排列
// ============================================================
// LeetCode 2289. Steps to Make Array Non-decreasing
// 每一轮删除所有满足 nums[i-1] > nums[i] 的元素 nums[i]（同时删除），直到数组非递减。
// 求总轮数。
// 方法1：单调栈 + 记录每个元素被删除的轮次。
// 方法2：链表模拟多轮删除（BFS 思想）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// ============================================================
// 方法1：单调栈
// ============================================================
function totalSteps_stack(nums: number[]): number {
  const n = nums.length;
  // dp[i] 表示删除 nums[i] 所需的轮次（若 nums[i] 未被删除，则其右侧被删除元素
  // 的轮次受 dp[i] 限制）
  const dp = new Array(n).fill(0);
  // 单调递减栈，存下标
  const stack: number[] = [];
  let result = 0;

  for (let i = 0; i < n; i++) {
    let curr = 0;
    // 当栈顶元素值 <= nums[i] 时，说明栈顶元素无法在它左侧"压制"nums[i]
    // 需要弹出，并把 dp 值传递过来（因为 nums[i] 的删除轮次受其左侧链路限制）
    while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[i]) {
      curr = Math.max(curr, dp[stack.pop()!]);
    }
    // 如果栈非空，说明 nums[i] 会被栈顶元素删除（在 curr+1 轮）
    if (stack.length > 0) {
      dp[i] = curr + 1;
      result = Math.max(result, dp[i]);
    } else {
      dp[i] = 0;
    }
    stack.push(i);
  }

  return result;
}

// ============================================================
// 方法2：链表模拟多轮删除（BFS）
// 用数组模拟双向链表，每轮同时删除节点，并将被删节点的后继作为下一轮候选。
// 时间复杂度：O(n)，空间复杂度：O(n)
// ============================================================
function totalSteps_linkedlist(nums: number[]): number {
  const n = nums.length;
  if (n <= 1) return 0;

  // 使用数组模拟双向链表
  const prev = new Array<number>(n);
  const next = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    prev[i] = i - 1;
    next[i] = i + 1 < n ? i + 1 : -1;
  }

  // removed 标记节点是否已被删除
  const removed = new Array<boolean>(n).fill(false);

  // 第一轮：找所有待删除节点（被左侧大于它的"原始"节点压制）
  let toDelete: number[] = [];
  for (let i = 1; i < n; i++) {
    if (nums[i - 1] > nums[i]) {
      toDelete.push(i);
    }
  }

  let steps = 0;
  while (toDelete.length > 0) {
    steps++;
    // 1. 同步标记所有本轮删除节点（同时删除语义）
    for (const idx of toDelete) removed[idx] = true;

    // 2. 收集下一轮候选：每个被删节点在删除后的后继
    const candidates: number[] = [];
    for (const idx of toDelete) {
      let s = next[idx];
      while (s !== -1 && removed[s]) s = next[s]; // 跳过已删节点
      if (s !== -1) candidates.push(s);
    }

    // 3. 断开被删节点：找到最近的非删前驱和后继并连接
    for (const idx of toDelete) {
      let p = prev[idx];
      while (p >= 0 && removed[p]) p = prev[p];
      let s = next[idx];
      while (s !== -1 && removed[s]) s = next[s];
      if (p >= 0) next[p] = s;
      if (s !== -1) prev[s] = p;
    }

    // 4. 筛选下一轮待删节点（候选的前驱值大于候选值）
    const seen = new Set<number>();
    const nextDelete: number[] = [];
    for (const c of candidates) {
      if (seen.has(c)) continue;
      seen.add(c);
      const p = prev[c];
      if (p >= 0 && nums[p] > nums[c]) {
        nextDelete.push(c);
      }
    }
    toDelete = nextDelete;
  }

  return steps;
}

// 主方法（默认使用方法1）
function totalSteps(nums: number[]): number {
  return totalSteps_stack(nums);
}

// ============================================================
// 测试
// ============================================================
function testTotalSteps(): void {
  // [5,3,4,4,7,3,6,11,8,5,11] -> 3
  console.log(totalSteps([5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11])); // 预期 3
  // [4,5,7,7,13] -> 0（已非递减）
  console.log(totalSteps([4, 5, 7, 7, 13])); // 预期 0
  // [10,1,2,3,4,5,6,7,8,9] -> 9（每轮只删一个：1,2,...,9）
  console.log(totalSteps([10, 1, 2, 3, 4, 5, 6, 7, 8, 9])); // 预期 9

  // 验证两种方法一致
  console.log(totalSteps_linkedlist([5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11])); // 预期 3
  console.log(totalSteps_linkedlist([4, 5, 7, 7, 13])); // 预期 0
  console.log(totalSteps_linkedlist([10, 1, 2, 3, 4, 5, 6, 7, 8, 9])); // 预期 9

  console.log("totalSteps 测试完成");
}

testTotalSteps();

export {};
