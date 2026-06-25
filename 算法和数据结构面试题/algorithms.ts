// ============================================================
// 数据结构与算法 - TypeScript 解题合集
// ============================================================

// -------------------- 链表节点定义 --------------------
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// ============================================================
// 1. 删除链表中重复的元素（排序链表）
// LeetCode 83. Remove Duplicates from Sorted List
// ============================================================

// 方法1：迭代法（推荐）
function deleteDuplicates(head: ListNode | null): ListNode | null {
  let current = head;
  while (current && current.next) {
    if (current.val === current.next.val) {
      current.next = current.next.next; // 跳过重复节点
    } else {
      current = current.next;
    }
  }
  return head;
}

// 方法2：递归法
function deleteDuplicatesRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  head.next = deleteDuplicatesRecursive(head.next);
  return head.val === head.next!.val ? head.next : head;
}

// ============================================================
// 2. 找到链表中的倒数第 k 个节点
// 面试题 02.02 / 剑指 Offer 22
// ============================================================

// 方法1：快慢指针（推荐）
// 快指针先走 k 步，然后快慢指针同步走，快指针到末尾时慢指针即为倒数第 k 个
function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  let fast: ListNode | null = head;
  let slow: ListNode | null = head;

  // 快指针先走 k 步
  for (let i = 0; i < k; i++) {
    if (!fast) return null; // k 大于链表长度
    fast = fast.next;
  }

  // 同步移动
  while (fast) {
    fast = fast.next;
    slow = slow!.next;
  }

  return slow;
}

// 方法2：先求长度再遍历
function getKthFromEndByLength(
  head: ListNode | null,
  k: number,
): ListNode | null {
  let len = 0;
  let current = head;
  while (current) {
    len++;
    current = current.next;
  }

  if (k > len) return null;

  current = head;
  for (let i = 0; i < len - k; i++) {
    current = current!.next;
  }
  return current;
}

// 方法3：栈方法
function getKthFromEndByStack(
  head: ListNode | null,
  k: number,
): ListNode | null {
  const stack: ListNode[] = [];
  let current = head;
  while (current) {
    stack.push(current);
    current = current.next;
  }
  if (k > stack.length || k <= 0) return null;
  return stack[stack.length - k];
}

// ============================================================
// 3. 判断链表中是否有环
// LeetCode 141. Linked List Cycle
// ============================================================

// 方法1：快慢指针（推荐）- O(1) 空间
function hasCycle(head: ListNode | null): boolean {
  if (!head || !head.next) return false;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}

// 方法2：哈希集合 - O(n) 空间
function hasCycleHashSet(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();
  let current = head;

  while (current) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = current.next;
  }

  return false;
}

// 方法3：标记法（修改节点值，不推荐但面试可提）
function hasCycleMark(head: ListNode | null): boolean {
  let current = head;
  while (current) {
    if (current.val === Infinity) return true; // 用特殊值标记已访问
    current.val = Infinity;
    current = current.next;
  }
  return false;
}

// ============================================================
// 4. 合并两个有序数组
// LeetCode 88. Merge Sorted Array
// ============================================================

// 方法1：逆向双指针（推荐）- 从后往前填充，不需要额外空间
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }

  // nums2 剩余元素
  while (j >= 0) {
    nums1[k--] = nums2[j--];
  }
}

// 方法2：正向双指针 + 额外空间
function mergeWithExtra(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number,
): void {
  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < m && j < n) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i++]);
    } else {
      result.push(nums2[j++]);
    }
  }

  while (i < m) result.push(nums1[i++]);
  while (j < n) result.push(nums2[j++]);

  for (let k = 0; k < result.length; k++) {
    nums1[k] = result[k];
  }
}

// 方法3：合并后排序（简单但效率低）
function mergeSort(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number,
): void {
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i];
  }
  nums1.sort((a, b) => a - b);
}

// ============================================================
// 5. 合并两个有序链表
// LeetCode 21. Merge Two Sorted Lists
// ============================================================

// 方法1：迭代法（推荐）
function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  const dummy = new ListNode(-1);
  let current = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  current.next = list1 || list2;
  return dummy.next;
}

// 方法2：递归法
function mergeTwoListsRecursive(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}

// ============================================================
// 6. 验证回文串
// LeetCode 125. Valid Palindrome
// ============================================================

// 方法1：双指针（推荐）
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0,
    right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

// 方法2：原地双指针（不创建新字符串）
function isPalindromeInPlace(s: string): boolean {
  const isAlphaNum = (c: string) => /[a-zA-Z0-9]/.test(c);
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }

  return true;
}

// 方法3：反转字符串比较
function isPalindromeReverse(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// ============================================================
// 7. 反转链表
// LeetCode 206. Reverse Linked List
// ============================================================

// 方法1：迭代法（推荐）
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }

  return prev;
}

// 方法2：递归法
function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// 方法3：栈方法
function reverseListStack(head: ListNode | null): ListNode | null {
  if (!head) return null;

  const stack: ListNode[] = [];
  let curr: ListNode | null = head;
  while (curr) {
    stack.push(curr);
    curr = curr.next;
  }

  const newHead = stack.pop()!;
  let node = newHead;
  while (stack.length) {
    node.next = stack.pop()!;
    node = node.next;
  }
  node.next = null;
  return newHead;
}

// ============================================================
// 8. 判断子序列
// LeetCode 392. Is Subsequence
// ============================================================

// 方法1：双指针（推荐）
function isSubsequence(s: string, t: string): boolean {
  let i = 0,
    j = 0;

  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i++;
    j++;
  }

  return i === s.length;
}

// 方法2：迭代器（利用 for...of）
function isSubsequenceIterator(s: string, t: string): boolean {
  const iterator = t[Symbol.iterator]();
  for (const char of s) {
    let result = iterator.next();
    while (!result.done && result.value !== char) {
      result = iterator.next();
    }
    if (result.done) return false;
  }
  return true;
}

// 方法3：动态规划（适用于大量 s 查询同一 t 的场景）
function isSubsequenceDP(s: string, t: string): boolean {
  // 预处理 t：dp[i][j] 表示从位置 i 开始，字符 j 下一次出现的位置
  const n = t.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(26).fill(n));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j < 26; j++) {
      dp[i][j] = dp[i + 1][j];
    }
    dp[i][t.charCodeAt(i) - 97] = i;
  }

  let pos = 0;
  for (const char of s) {
    const idx = char.charCodeAt(0) - 97;
    if (dp[pos][idx] === n) return false;
    pos = dp[pos][idx] + 1;
  }
  return true;
}

// ============================================================
// 9. 删除排序数组中的重复项
// LeetCode 26. Remove Duplicates from Sorted Array
// ============================================================

// 方法1：快慢指针（推荐）
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}

// 方法2：通用去重（允许重复 N 次的模板）
function removeDuplicatesAtMostN(
  nums: number[],
  maxRepeat: number = 1,
): number {
  let i = 0;
  for (const num of nums) {
    if (i < maxRepeat || nums[i - maxRepeat] !== num) {
      nums[i] = num;
      i++;
    }
  }
  return i;
}

// 方法3：Set 去重（非原地，需额外空间）
function removeDuplicatesBySet(nums: number[]): number {
  const unique = [...new Set(nums)];
  for (let i = 0; i < unique.length; i++) {
    nums[i] = unique[i];
  }
  return unique.length;
}

// ============================================================
// 10. 寻找链表的中间节点
// LeetCode 876. Middle of the Linked List
// ============================================================

// 方法1：快慢指针（推荐）
function middleNode(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}

// 方法2：先求长度再遍历
function middleNodeByLength(head: ListNode | null): ListNode | null {
  let len = 0;
  let current = head;
  while (current) {
    len++;
    current = current.next;
  }

  const mid = Math.floor(len / 2);
  current = head;
  for (let i = 0; i < mid; i++) {
    current = current!.next;
  }
  return current;
}

// 方法3：数组存储
function middleNodeByArray(head: ListNode | null): ListNode | null {
  const nodes: ListNode[] = [];
  let current = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }
  return nodes[Math.floor(nodes.length / 2)];
}

// ============================================================
// 11. 删除链表中的节点
// LeetCode 237. Delete Node in a Linked List
// ============================================================

// 方法1：值覆盖法（题目给定只能访问被删节点）
function deleteNode(node: ListNode | null): void {
  if (!node || !node.next) return;
  node.val = node.next.val; // 将下一个节点的值复制过来
  node.next = node.next.next; // 跳过下一个节点
}

// 方法2：已知头节点 + 目标值删除
function deleteNodeByValue(
  head: ListNode | null,
  val: number,
): ListNode | null {
  const dummy = new ListNode(0, head);
  let current: ListNode | null = dummy;

  while (current.next) {
    if (current.next.val === val) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }

  return dummy.next;
}

// ============================================================
// 12. 移动零
// LeetCode 283. Move Zeroes
// ============================================================

// 方法1：快慢指针（推荐）- 保持非零元素相对顺序
function moveZeroes(nums: number[]): void {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
}

// 方法2：先覆盖再补零
function moveZeroesFill(nums: number[]): void {
  let pos = 0;
  for (const num of nums) {
    if (num !== 0) {
      nums[pos++] = num;
    }
  }
  while (pos < nums.length) {
    nums[pos++] = 0;
  }
}

// 方法3：双指针交换（最少写操作）
function moveZeroesSwap(nums: number[]): void {
  let left = 0,
    right = 0;
  while (right < nums.length) {
    if (nums[right] !== 0) {
      if (left !== right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
      }
      left++;
    }
    right++;
  }
}

// ============================================================
// 13. 两数之和
// LeetCode 1. Two Sum
// ============================================================

// 方法1：哈希表（推荐）- O(n) 时间
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// 方法2：暴力枚举 - O(n^2) 时间
function twoSumBruteForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// 方法3：排序 + 双指针（返回值而非索引）
function twoSumTwoPointer(nums: number[], target: number): number[] {
  const sorted = nums
    .map((val, idx) => ({ val, idx }))
    .sort((a, b) => a.val - b.val);
  let left = 0,
    right = sorted.length - 1;

  while (left < right) {
    const sum = sorted[left].val + sorted[right].val;
    if (sum === target) {
      return [sorted[left].idx, sorted[right].idx];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

// ============================================================
// 14. 冒泡排序
// ============================================================

// 方法1：标准冒泡排序
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 方法2：优化版 - 提前退出标志
function bubbleSortOptimized(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // 本轮无交换，已排序完成
  }
  return arr;
}

// 方法3：记录最后交换位置
function bubbleSortBoundary(arr: number[]): number[] {
  let n = arr.length;
  while (n > 1) {
    let lastSwap = 0;
    for (let j = 0; j < n - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        lastSwap = j + 1; // 记录最后交换的位置
      }
    }
    n = lastSwap; // 下一轮只需遍历到最后交换位置
  }
  return arr;
}

// ============================================================
// 15. 单次购买的最大利润（买卖股票的最佳时机 I）
// LeetCode 121. Best Time to Buy and Sell Stock
// ============================================================

// 方法1：一次遍历（推荐）- 维护最小值和最大利润
function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}

// 方法2：动态规划
function maxProfitDP(prices: number[]): number {
  if (prices.length === 0) return 0;

  // dp[i][0] = 第 i 天不持有股票的最大利润
  // dp[i][1] = 第 i 天持有股票的最大利润
  const n = prices.length;
  let noStock = 0;
  let hasStock = -prices[0];

  for (let i = 1; i < n; i++) {
    noStock = Math.max(noStock, hasStock + prices[i]);
    hasStock = Math.max(hasStock, -prices[i]);
  }

  return noStock;
}

// 方法3：暴力枚举（不推荐，仅理解用）
function maxProfitBruteForce(prices: number[]): number {
  let maxProfit = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
    }
  }
  return maxProfit;
}

// ============================================================
// 16. 斐波那契数列
// LeetCode 509. Fibonacci Number
// ============================================================

// 方法1：迭代法（推荐）- O(n) 时间 O(1) 空间
function fib(n: number): number {
  if (n <= 1) return n;

  let prev = 0,
    curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// 方法2：动态规划 - O(n) 时间 O(n) 空间
function fibDP(n: number): number {
  if (n <= 1) return n;

  const dp: number[] = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 方法3：递归法（加记忆化）
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// 方法4：矩阵快速幂 - O(log n) 时间
function fibMatrix(n: number): number {
  if (n <= 1) return n;

  const multiply = (a: number[][], b: number[][]): number[][] => {
    return [
      [
        a[0][0] * b[0][0] + a[0][1] * b[1][0],
        a[0][0] * b[0][1] + a[0][1] * b[1][1],
      ],
      [
        a[1][0] * b[0][0] + a[1][1] * b[1][0],
        a[1][0] * b[0][1] + a[1][1] * b[1][1],
      ],
    ];
  };

  const matrixPow = (mat: number[][], power: number): number[][] => {
    let result: number[][] = [
      [1, 0],
      [0, 1],
    ]; // 单位矩阵
    while (power > 0) {
      if (power % 2 === 1) result = multiply(result, mat);
      mat = multiply(mat, mat);
      power = Math.floor(power / 2);
    }
    return result;
  };

  const M: number[][] = [
    [1, 1],
    [1, 0],
  ];
  const result = matrixPow(M, n - 1);
  return result[0][0];
}

// 方法5：通项公式（Binet's Formula）
function fibFormula(n: number): number {
  const sqrt5 = Math.sqrt(5);
  return Math.round(
    (Math.pow((1 + sqrt5) / 2, n) - Math.pow((1 - sqrt5) / 2, n)) / sqrt5,
  );
}

// ============================================================
// 17. 最大子序和
// LeetCode 53. Maximum Subarray
// ============================================================

// 方法1：Kadane 算法（推荐）- O(n) 时间 O(1) 空间
function maxSubArray(nums: number[]): number {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// 方法2：动态规划 - O(n) 时间 O(n) 空间
function maxSubArrayDP(nums: number[]): number {
  const dp: number[] = [nums[0]];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
    maxSum = Math.max(maxSum, dp[i]);
  }

  return maxSum;
}

// 方法3：分治法 - O(n log n)
function maxSubArrayDivide(nums: number[]): number {
  const helper = (left: number, right: number): number => {
    if (left === right) return nums[left];

    const mid = Math.floor((left + right) / 2);

    // 左半部分最大子序和
    const leftMax = helper(left, mid);
    // 右半部分最大子序和
    const rightMax = helper(mid + 1, right);

    // 跨越中间的最大子序和
    let leftBorderMax = -Infinity,
      leftBorderSum = 0;
    for (let i = mid; i >= left; i--) {
      leftBorderSum += nums[i];
      leftBorderMax = Math.max(leftBorderMax, leftBorderSum);
    }

    let rightBorderMax = -Infinity,
      rightBorderSum = 0;
    for (let i = mid + 1; i <= right; i++) {
      rightBorderSum += nums[i];
      rightBorderMax = Math.max(rightBorderMax, rightBorderSum);
    }

    const crossMax = leftBorderMax + rightBorderMax;
    return Math.max(leftMax, rightMax, crossMax);
  };

  return helper(0, nums.length - 1);
}

// 方法4：前缀和
function maxSubArrayPrefixSum(nums: number[]): number {
  let prefixSum = 0;
  let minPrefix = 0;
  let maxSum = -Infinity;

  for (const num of nums) {
    prefixSum += num;
    maxSum = Math.max(maxSum, prefixSum - minPrefix);
    minPrefix = Math.min(minPrefix, prefixSum);
  }

  return maxSum;
}

// ============================================================
// 18. 爬楼梯
// LeetCode 70. Climbing Stairs
// ============================================================

// 方法1：迭代法（推荐）- 本质就是斐波那契
function climbStairs(n: number): number {
  if (n <= 2) return n;

  let prev = 1,
    curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// 方法2：动态规划
function climbStairsDP(n: number): number {
  if (n <= 2) return n;

  const dp: number[] = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 方法3：递归 + 记忆化
function climbStairsMemo(
  n: number,
  memo: Map<number, number> = new Map(),
): number {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// 方法4：矩阵快速幂 - O(log n)
function climbStairsMatrix(n: number): number {
  if (n <= 2) return n;

  const multiply = (a: number[][], b: number[][]): number[][] => {
    return [
      [
        a[0][0] * b[0][0] + a[0][1] * b[1][0],
        a[0][0] * b[0][1] + a[0][1] * b[1][1],
      ],
      [
        a[1][0] * b[0][0] + a[1][1] * b[1][0],
        a[1][0] * b[0][1] + a[1][1] * b[1][1],
      ],
    ];
  };

  const matrixPow = (mat: number[][], power: number): number[][] => {
    let result: number[][] = [
      [1, 0],
      [0, 1],
    ];
    while (power > 0) {
      if (power % 2 === 1) result = multiply(result, mat);
      mat = multiply(mat, mat);
      power = Math.floor(power / 2);
    }
    return result;
  };

  const M: number[][] = [
    [1, 1],
    [1, 0],
  ];
  const result = matrixPow(M, n - 1);
  return result[0][0] * 2 + result[0][1] * 1;
}

// 方法5：通项公式
function climbStairsFormula(n: number): number {
  const sqrt5 = Math.sqrt(5);
  return Math.round(
    (Math.pow((1 + sqrt5) / 2, n + 1) - Math.pow((1 - sqrt5) / 2, n + 1)) /
      sqrt5,
  );
}

// ============================================================
// 19. 试除法求约数
// ============================================================

// 方法1：试除法 - O(sqrt(n))
function getDivisors(n: number): number[] {
  if (n <= 0) return [];

  const divisors: number[] = [];
  const sqrtN = Math.floor(Math.sqrt(n));

  for (let i = 1; i <= sqrtN; i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i !== n / i) {
        divisors.push(n / i);
      }
    }
  }

  return divisors.sort((a, b) => a - b);
}

// 方法2：试除法求约数个数
function countDivisors(n: number): number {
  if (n <= 0) return 0;

  let count = 0;
  const sqrtN = Math.floor(Math.sqrt(n));

  for (let i = 1; i <= sqrtN; i++) {
    if (n % i === 0) {
      count += i === n / i ? 1 : 2;
    }
  }

  return count;
}

// 方法3：试除法求约数之和
function sumDivisors(n: number): number {
  if (n <= 0) return 0;

  let sum = 0;
  const sqrtN = Math.floor(Math.sqrt(n));

  for (let i = 1; i <= sqrtN; i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) {
        sum += n / i;
      }
    }
  }

  return sum;
}

// ============================================================
// 20. 试除法判定质数
// ============================================================

// 方法1：试除法 - O(sqrt(n))
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const sqrtN = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= sqrtN; i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}

// 方法2：6k ± 1 优化试除法
// 所有大于 3 的质数都可以表示为 6k ± 1
function isPrime6k(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  const sqrtN = Math.floor(Math.sqrt(n));
  for (let i = 5; i <= sqrtN; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}

// 方法3：埃拉托斯特尼筛法 - 批量求质数
function sieveOfEratosthenes(max: number): boolean[] {
  const isPrimeArr: boolean[] = new Array(max + 1).fill(true);
  isPrimeArr[0] = false;
  isPrimeArr[1] = false;

  for (let i = 2; i * i <= max; i++) {
    if (isPrimeArr[i]) {
      for (let j = i * i; j <= max; j += i) {
        isPrimeArr[j] = false;
      }
    }
  }

  return isPrimeArr; // isPrimeArr[n] 即为 n 是否为质数
}

// 方法4：线性筛（欧拉筛）- 批量求质数，每个合数只被最小质因子筛一次
function eulerSieve(max: number): { primes: number[]; isPrime: boolean[] } {
  const isPrimeArr: boolean[] = new Array(max + 1).fill(true);
  const primes: number[] = [];
  isPrimeArr[0] = false;
  isPrimeArr[1] = false;

  for (let i = 2; i <= max; i++) {
    if (isPrimeArr[i]) primes.push(i);
    for (const p of primes) {
      if (i * p > max) break;
      isPrimeArr[i * p] = false;
      if (i % p === 0) break; // 保证每个合数只被最小质因子筛一次
    }
  }

  return { primes, isPrime: isPrimeArr };
}

// ============================================================
// 测试
// ============================================================

// --- 链表辅助函数 ---
function createList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode(0);
  let current = dummy;
  for (const val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

// --- 测试用例 ---
console.log("===== 1. 删除链表中重复的元素 =====");
console.log(listToArray(deleteDuplicates(createList([1, 1, 2, 3, 3])))); // [1, 2, 3]
console.log(listToArray(deleteDuplicatesRecursive(createList([1, 1, 2])))); // [1, 2]

console.log("\n===== 2. 倒数第 k 个节点 =====");
console.log(getKthFromEnd(createList([1, 2, 3, 4, 5]), 2)?.val); // 4
console.log(getKthFromEndByLength(createList([1, 2, 3, 4, 5]), 1)?.val); // 5

console.log("\n===== 3. 判断链表是否有环 =====");
const cycleNode = new ListNode(2);
const cycleHead = new ListNode(3, cycleNode);
cycleNode.next = new ListNode(0, new ListNode(-4, cycleNode));
console.log(hasCycle(cycleHead)); // true
console.log(hasCycleHashSet(createList([1, 2, 3, 4]))); // false

console.log("\n===== 4. 合并两个有序数组 =====");
const nums1a = [1, 2, 3, 0, 0, 0];
merge(nums1a, 3, [2, 5, 6], 3);
console.log(nums1a); // [1, 2, 2, 3, 5, 6]

console.log("\n===== 5. 合并两个有序链表 =====");
console.log(
  listToArray(mergeTwoLists(createList([1, 2, 4]), createList([1, 3, 4]))),
); // [1, 1, 2, 3, 4, 4]

console.log("\n===== 6. 验证回文串 =====");
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeInPlace("race a car")); // false

console.log("\n===== 7. 反转链表 =====");
console.log(listToArray(reverseList(createList([1, 2, 3, 4, 5])))); // [5, 4, 3, 2, 1]
console.log(listToArray(reverseListRecursive(createList([1, 2])))); // [2, 1]

console.log("\n===== 8. 判断子序列 =====");
console.log(isSubsequence("abc", "ahbgdc")); // true
console.log(isSubsequence("axc", "ahbgdc")); // false

console.log("\n===== 9. 删除排序数组中的重复项 =====");
const arr9 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
console.log(removeDuplicates(arr9), arr9.slice(0, 5)); // 5, [0, 1, 2, 3, 4]

console.log("\n===== 10. 寻找链表的中间节点 =====");
console.log(middleNode(createList([1, 2, 3, 4, 5]))?.val); // 3
console.log(middleNode(createList([1, 2, 3, 4, 5, 6]))?.val); // 4

console.log("\n===== 11. 删除链表中的节点 =====");
const node11 = createList([4, 5, 1, 9]);
const toDelete = node11?.next!; // 节点 5
deleteNode(toDelete);
console.log(listToArray(node11)); // [4, 1, 9]

console.log("\n===== 12. 移动零 =====");
const arr12 = [0, 1, 0, 3, 12];
moveZeroes(arr12);
console.log(arr12); // [1, 3, 12, 0, 0]

console.log("\n===== 13. 两数之和 =====");
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSumBruteForce([3, 2, 4], 6)); // [1, 2]

console.log("\n===== 14. 冒泡排序 =====");
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90])); // [11, 12, 22, 25, 34, 64, 90]
console.log(bubbleSortOptimized([5, 1, 4, 2, 8])); // [1, 2, 4, 5, 8]

console.log("\n===== 15. 单次购买的最大利润 =====");
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfitDP([7, 6, 4, 3, 1])); // 0

console.log("\n===== 16. 斐波那契数列 =====");
console.log(fib(10)); // 55
console.log(fibDP(10)); // 55
console.log(fibMemo(10)); // 55
console.log(fibMatrix(10)); // 55
console.log(fibFormula(10)); // 55

console.log("\n===== 17. 最大子序和 =====");
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArrayDP([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6

console.log("\n===== 18. 爬楼梯 =====");
console.log(climbStairs(5)); // 8
console.log(climbStairsDP(5)); // 8

console.log("\n===== 19. 试除法求约数 =====");
console.log(getDivisors(12)); // [1, 2, 3, 4, 6, 12]
console.log(countDivisors(12)); // 6
console.log(sumDivisors(12)); // 28

console.log("\n===== 20. 试除法判定质数 =====");
console.log(isPrime(17)); // true
console.log(isPrime(4)); // false
console.log(isPrime6k(97)); // true
// 埃拉托斯特尼筛法求 20 以内的质数
const sieve = sieveOfEratosthenes(20);
const primes20: number[] = [];
for (let i = 2; i <= 20; i++) {
  if (sieve[i]) primes20.push(i);
}
console.log(primes20); // [2, 3, 5, 7, 11, 13, 17, 19]

export {};
