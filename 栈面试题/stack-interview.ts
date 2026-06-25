// ============================================================
// 栈面试题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 1. 括号匹配
// LeetCode 20. Valid Parentheses
// 核心思路：遇到左括号入栈，遇到右括号弹出栈顶并判断是否匹配
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：栈 + Map 映射（推荐）
function isValid(s: string): boolean {
  const map: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };
  const stack: string[] = [];

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }

  return stack.length === 0;
}

// 方法2：栈 + switch 匹配
function isValidSwitch(s: string): boolean {
  const stack: string[] = [];

  for (const char of s) {
    switch (char) {
      case "(":
      case "[":
      case "{":
        stack.push(char);
        break;
      case ")":
        if (stack.pop() !== "(") return false;
        break;
      case "]":
        if (stack.pop() !== "[") return false;
        break;
      case "}":
        if (stack.pop() !== "{") return false;
        break;
    }
  }

  return stack.length === 0;
}

// 方法3：替换法 — 反复消除配对括号，若最终为空则合法
function isValidReplace(s: string): boolean {
  const pairs = ["()", "[]", "{}"];
  let prev = "";
  while (s !== prev) {
    prev = s;
    for (const pair of pairs) {
      s = s.split(pair).join("");
    }
  }
  return s.length === 0;
}

// ============================================================
// 2. 最小栈
// LeetCode 155. Min Stack
// 核心思路：用辅助栈同步记录每个位置对应的最小值
// 时间复杂度：所有操作 O(1)
// 空间复杂度：O(n)
// ============================================================

// 方法1：辅助栈（推荐）— 同步维护最小值栈
class MinStack {
  private stack: number[];
  private minStack: number[];

  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val: number): void {
    this.stack.push(val);
    // minStack 栈顶始终是当前最小值
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    } else {
      this.minStack.push(this.minStack[this.minStack.length - 1]);
    }
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

// 方法2：差值法 — 不用辅助栈，用差值编码最小值
class MinStackDiff {
  private stack: number[];
  private min: number;

  constructor() {
    this.stack = [];
    this.min = Infinity;
  }

  push(val: number): void {
    if (this.stack.length === 0) {
      this.stack.push(0);
      this.min = val;
    } else {
      // 存储与当前最小值的差值
      this.stack.push(val - this.min);
      if (val < this.min) this.min = val;
    }
  }

  pop(): void {
    const diff = this.stack.pop()!;
    if (diff < 0) {
      // 差值为负说明栈顶就是最小值，需要还原上一个最小值
      this.min = this.min - diff;
    }
  }

  top(): number {
    const diff = this.stack[this.stack.length - 1];
    if (diff < 0) return this.min;
    return this.min + diff;
  }

  getMin(): number {
    return this.min;
  }
}

// 方法3：节点法 — 每个节点自带当前最小值
class MinStackNode {
  private head: { val: number; min: number; next: { val: number; min: number; next: any } | null } | null;

  constructor() {
    this.head = null;
  }

  push(val: number): void {
    if (this.head === null) {
      this.head = { val, min: val, next: null };
    } else {
      this.head = { val, min: Math.min(val, this.head.min), next: this.head };
    }
  }

  pop(): void {
    this.head = this.head!.next;
  }

  top(): number {
    return this.head!.val;
  }

  getMin(): number {
    return this.head!.min;
  }
}

// ============================================================
// 3. 栈的链式存储
// 核心思路：用链表节点实现栈，头插法模拟入栈，头删法模拟出栈
// 时间复杂度：所有操作 O(1)
// 空间复杂度：O(n)
// ============================================================

// 链栈节点
class LinkedStackNode<T> {
  val: T;
  next: LinkedStackNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}

// 方法1：链式栈（推荐）— 头插头删
class LinkedStack<T> {
  private head: LinkedStackNode<T> | null;
  private _size: number;

  constructor() {
    this.head = null;
    this._size = 0;
  }

  // 入栈：头插法
  push(val: T): void {
    const node = new LinkedStackNode(val);
    node.next = this.head;
    this.head = node;
    this._size++;
  }

  // 出栈：头删法
  pop(): T | undefined {
    if (this.head === null) return undefined;
    const val = this.head.val;
    this.head = this.head.next;
    this._size--;
    return val;
  }

  // 查看栈顶
  peek(): T | undefined {
    return this.head?.val;
  }

  // 栈是否为空
  isEmpty(): boolean {
    return this.head === null;
  }

  // 栈大小
  size(): number {
    return this._size;
  }

  // 转数组（从栈顶到栈底）
  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.val);
      curr = curr.next;
    }
    return result;
  }
}

// 方法2：带虚拟头节点的链式栈
class LinkedStackWithDummy<T> {
  private dummy: LinkedStackNode<T>;
  private _size: number;

  constructor() {
    this.dummy = new LinkedStackNode(null as T);
    this._size = 0;
  }

  push(val: T): void {
    const node = new LinkedStackNode(val);
    node.next = this.dummy.next;
    this.dummy.next = node;
    this._size++;
  }

  pop(): T | undefined {
    if (this.dummy.next === null) return undefined;
    const val = this.dummy.next.val;
    this.dummy.next = this.dummy.next.next;
    this._size--;
    return val;
  }

  peek(): T | undefined {
    return this.dummy.next?.val;
  }

  isEmpty(): boolean {
    return this.dummy.next === null;
  }

  size(): number {
    return this._size;
  }
}

// ============================================================
// 4. 逆波兰表达式求值
// LeetCode 150. Evaluate Reverse Polish Notation
// 核心思路：遇到数字入栈，遇到运算符弹出两个操作数计算后结果入栈
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：栈 + switch（推荐）
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    switch (token) {
      case "+":
        stack.push(stack.pop()! + stack.pop()!);
        break;
      case "-": {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(a - b);
        break;
      }
      case "*":
        stack.push(stack.pop()! * stack.pop()!);
        break;
      case "/": {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(Math.trunc(a / b));
        break;
      }
      default:
        stack.push(Number(token));
    }
  }

  return stack[0];
}

// 方法2：栈 + 运算符映射
function evalRPNMap(tokens: string[]): number {
  const stack: number[] = [];
  const ops: Record<string, (a: number, b: number) => number> = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b),
  };

  for (const token of tokens) {
    if (token in ops) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(ops[token](a, b));
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}

// 方法3：递归法 — 从末尾递归计算
function evalRPNRecursive(tokens: string[]): number {
  let idx = tokens.length - 1;

  const evaluate = (): number => {
    const token = tokens[idx--];
    if (token !== "+" && token !== "-" && token !== "*" && token !== "/") {
      return Number(token);
    }
    // 注意：递归先算右操作数，再算左操作数
    const right = evaluate();
    const left = evaluate();

    switch (token) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return Math.trunc(left / right);
      default: return 0;
    }
  };

  return evaluate();
}

// ============================================================
// 5. 表达式求值
// LeetCode 224 / 227. Basic Calculator
// 核心思路：中缀表达式求值，用两个栈分别存操作数和运算符，处理优先级
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：双栈法 — 操作数栈 + 运算符栈（推荐）
function calculate(s: string): number {
  const nums: number[] = [];  // 操作数栈
  const ops: string[] = [];    // 运算符栈

  // 运算符优先级
  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  // 执行一次运算
  const evalOnce = (): void => {
    const op = ops.pop()!;
    const b = nums.pop()!;
    const a = nums.pop()!;
    switch (op) {
      case "+": nums.push(a + b); break;
      case "-": nums.push(a - b); break;
      case "*": nums.push(a * b); break;
      case "/": nums.push(Math.trunc(a / b)); break;
    }
  };

  // 处理一元负号：在表达式开头或左括号后的 '-' 转为 "0 -"
  s = s.replace(/^\s*-/, "0-").replace(/\(\s*-/g, "(0-");

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === " ") continue;

    if (char === "(") {
      ops.push(char);
    } else if (char === ")") {
      // 弹出运算符直到遇到左括号
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        evalOnce();
      }
      ops.pop(); // 弹出左括号
    } else if ("0123456789".includes(char)) {
      // 解析完整数字
      let num = 0;
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        num = num * 10 + Number(s[i]);
        i++;
      }
      i--; // 回退一位
      nums.push(num);
    } else {
      // 运算符：先把优先级 >= 当前运算符的都计算掉
      while (ops.length > 0 && ops[ops.length - 1] !== "(" && precedence[ops[ops.length - 1]] >= precedence[char]) {
        evalOnce();
      }
      ops.push(char);
    }
  }

  // 处理剩余运算符
  while (ops.length > 0) {
    evalOnce();
  }

  return nums[0];
}

// 方法2：仅含加减和括号的表达式求值（LeetCode 224）
function calculateAddSub(s: string): number {
  const stack: number[] = [];
  let result = 0;
  let sign = 1; // 1 表示正，-1 表示负
  let num = 0;

  for (const char of s) {
    if (char >= "0" && char <= "9") {
      num = num * 10 + Number(char);
    } else if (char === "+") {
      result += sign * num;
      num = 0;
      sign = 1;
    } else if (char === "-") {
      result += sign * num;
      num = 0;
      sign = -1;
    } else if (char === "(") {
      // 保存当前结果和符号
      stack.push(result);
      stack.push(sign);
      result = 0;
      sign = 1;
    } else if (char === ")") {
      result += sign * num;
      num = 0;
      result *= stack.pop()!; // 弹出符号
      result += stack.pop()!; // 弹出之前的结果
    }
  }

  return result + sign * num;
}

// 方法3：后缀表达式转换 + 求值
function calculatePostfix(s: string): number {
  // 第一步：中缀转后缀
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

  let i = 0;
  while (i < s.length) {
    const char = s[i];
    if (char === " ") { i++; continue; }

    if (char >= "0" && char <= "9") {
      let num = "";
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        num += s[i];
        i++;
      }
      output.push(num);
      continue;
    } else if (char === "(") {
      ops.push(char);
    } else if (char === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        output.push(ops.pop()!);
      }
      ops.pop();
    } else {
      while (ops.length > 0 && ops[ops.length - 1] !== "(" && precedence[ops[ops.length - 1]] >= precedence[char]) {
        output.push(ops.pop()!);
      }
      ops.push(char);
    }
    i++;
  }

  while (ops.length > 0) output.push(ops.pop()!);

  // 第二步：求值后缀表达式
  return evalRPN(output);
}

// ============================================================
// 6. 下一个更大元素 I
// LeetCode 496. Next Greater Element I
// 核心思路：单调栈预处理 nums2 中每个元素的下一个更大值，再映射查询
// 时间复杂度：O(n + m)
// 空间复杂度：O(n)
// ============================================================

// 方法1：单调栈 + Map（推荐）
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  // 单调栈预处理 nums2
  const nextGreater: Map<number, number> = new Map();
  const stack: number[] = []; // 单调递减栈

  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      nextGreater.set(stack.pop()!, num);
    }
    stack.push(num);
  }

  // 栈中剩余元素没有更大值
  while (stack.length > 0) {
    nextGreater.set(stack.pop()!, -1);
  }

  // 查询 nums1
  return nums1.map((num) => nextGreater.get(num)!);
}

// 方法2：暴力法 — O(n * m)
function nextGreaterElementBruteForce(nums1: number[], nums2: number[]): number[] {
  return nums1.map((num) => {
    const idx = nums2.indexOf(num);
    for (let i = idx + 1; i < nums2.length; i++) {
      if (nums2[i] > num) return nums2[i];
    }
    return -1;
  });
}

// 方法3：单调栈 + 从右向左遍历
function nextGreaterElementRightToLeft(nums1: number[], nums2: number[]): number[] {
  const nextGreater: Map<number, number> = new Map();
  const stack: number[] = []; // 单调递减栈

  // 从右向左遍历
  for (let i = nums2.length - 1; i >= 0; i--) {
    while (stack.length > 0 && nums2[i] >= stack[stack.length - 1]) {
      stack.pop();
    }
    nextGreater.set(nums2[i], stack.length > 0 ? stack[stack.length - 1] : -1);
    stack.push(nums2[i]);
  }

  return nums1.map((num) => nextGreater.get(num)!);
}

// ============================================================
// 7. 用栈实现队列
// LeetCode 232. Implement Queue using Stacks
// 核心思路：两个栈，一个负责入队，一个负责出队，倒栈时保证 FIFO
// 时间复杂度：push O(1)，pop 均摊 O(1)
// 空间复杂度：O(n)
// ============================================================

// 方法1：双栈 — 懒倒栈（推荐）
class MyQueue {
  private inStack: number[];
  private outStack: number[];

  constructor() {
    this.inStack = [];
    this.outStack = [];
  }

  push(x: number): void {
    this.inStack.push(x);
  }

  pop(): number {
    this.ensureOutStack();
    return this.outStack.pop()!;
  }

  peek(): number {
    this.ensureOutStack();
    return this.outStack[this.outStack.length - 1];
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }

  // 当 outStack 为空时，把 inStack 全部倒入 outStack
  private ensureOutStack(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
  }
}

// 方法2：双栈 — 每次 pop 都倒栈
class MyQueueAlwaysTransfer {
  private stack1: number[];
  private stack2: number[];

  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  push(x: number): void {
    this.stack1.push(x);
  }

  pop(): number {
    // 把 stack1 全部倒入 stack2
    while (this.stack1.length > 0) {
      this.stack2.push(this.stack1.pop()!);
    }
    const val = this.stack2.pop()!;
    // 再倒回 stack1
    while (this.stack2.length > 0) {
      this.stack1.push(this.stack2.pop()!);
    }
    return val;
  }

  peek(): number {
    while (this.stack1.length > 0) {
      this.stack2.push(this.stack1.pop()!);
    }
    const val = this.stack2[this.stack2.length - 1];
    while (this.stack2.length > 0) {
      this.stack1.push(this.stack2.pop()!);
    }
    return val;
  }

  empty(): boolean {
    return this.stack1.length === 0;
  }
}

// ============================================================
// 8. 用队列实现栈
// LeetCode 225. Implement Stack using Queues
// 核心思路：入队后把前面的元素依次出队再入队，保证队首始终是栈顶
// 时间复杂度：push O(n)，pop O(1)
// 空间复杂度：O(n)
// ============================================================

// 方法1：单队列旋转法（推荐）
class MyStack {
  private queue: number[];

  constructor() {
    this.queue = [];
  }

  push(x: number): void {
    this.queue.push(x);
    // 把新元素前面的所有元素移到后面
    const size = this.queue.length;
    for (let i = 0; i < size - 1; i++) {
      this.queue.push(this.queue.shift()!);
    }
  }

  pop(): number {
    return this.queue.shift()!;
  }

  top(): number {
    return this.queue[0];
  }

  empty(): boolean {
    return this.queue.length === 0;
  }
}

// 方法2：双队列法
class MyStackTwoQueues {
  private q1: number[];
  private q2: number[];

  constructor() {
    this.q1 = [];
    this.q2 = [];
  }

  push(x: number): void {
    // 先放入 q2，再把 q1 全部倒入 q2，交换 q1 和 q2
    this.q2.push(x);
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift()!);
    }
    [this.q1, this.q2] = [this.q2, this.q1];
  }

  pop(): number {
    return this.q1.shift()!;
  }

  top(): number {
    return this.q1[0];
  }

  empty(): boolean {
    return this.q1.length === 0;
  }
}

// 方法3：双队列 — pop 时倒队列
class MyStackPopTransfer {
  private q1: number[];
  private q2: number[];

  constructor() {
    this.q1 = [];
    this.q2 = [];
  }

  push(x: number): void {
    this.q1.push(x);
  }

  pop(): number {
    // 把 q1 前面的都移到 q2，只剩最后一个
    while (this.q1.length > 1) {
      this.q2.push(this.q1.shift()!);
    }
    const val = this.q1.shift()!;
    [this.q1, this.q2] = [this.q2, this.q1];
    return val;
  }

  top(): number {
    while (this.q1.length > 1) {
      this.q2.push(this.q1.shift()!);
    }
    const val = this.q1[0];
    this.q2.push(this.q1.shift()!);
    [this.q1, this.q2] = [this.q2, this.q1];
    return val;
  }

  empty(): boolean {
    return this.q1.length === 0;
  }
}

// ============================================================
// 9. 下一个更大元素 II（循环数组）
// LeetCode 503. Next Greater Element II
// 核心思路：将数组复制一份拼接，用单调栈求下一个更大值；或用取模方式遍历两遍
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：单调栈 + 取模遍历两遍（推荐）
function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = []; // 存下标，单调递减栈

  // 遍历两遍数组（用取模模拟循环）
  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n;
    while (stack.length > 0 && nums[idx] > nums[stack[stack.length - 1]]) {
      result[stack.pop()!] = nums[idx];
    }
    // 只在第一遍时入栈
    if (i < n) stack.push(idx);
  }

  return result;
}

// 方法2：数组拼接法
function nextGreaterElementsConcat(nums: number[]): number[] {
  const doubled = [...nums, ...nums];
  const n = nums.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < doubled.length; i++) {
    while (stack.length > 0 && doubled[i] > doubled[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      if (idx < n) result[idx] = doubled[i];
    }
    stack.push(i);
  }

  return result;
}

// 方法3：从右向左单调栈
function nextGreaterElementsRightToLeft(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = [];

  // 从右向左遍历两遍
  for (let i = 2 * n - 1; i >= 0; i--) {
    const idx = i % n;
    while (stack.length > 0 && nums[idx] >= nums[stack[stack.length - 1]]) {
      stack.pop();
    }
    if (stack.length > 0 && i < n) {
      result[idx] = nums[stack[stack.length - 1]];
    }
    stack.push(idx);
  }

  return result;
}

// ============================================================
// 10. 下一个更大元素 III（给定一个正整数）
// LeetCode 556. Next Greater Element III
// 核心思路：与"下一个排列"相同 — 从右找第一个升序对，交换后反转后续部分
// 时间复杂度：O(d)，d 为数字位数
// 空间复杂度：O(d)
// ============================================================

// 方法1：转数组 + 下一个排列（推荐）
function nextGreaterElementIII(n: number): number {
  const digits = String(n).split("").map(Number);
  const len = digits.length;

  // 第一步：从右向左找第一个 digits[i] < digits[i+1] 的位置
  let i = len - 2;
  while (i >= 0 && digits[i] >= digits[i + 1]) {
    i--;
  }

  if (i < 0) return -1; // 已经是最大排列

  // 第二步：从右向左找第一个大于 digits[i] 的位置
  let j = len - 1;
  while (digits[j] <= digits[i]) {
    j--;
  }

  // 第三步：交换
  [digits[i], digits[j]] = [digits[j], digits[i]];

  // 第四步：反转 i+1 到末尾
  let left = i + 1;
  let right = len - 1;
  while (left < right) {
    [digits[left], digits[right]] = [digits[right], digits[left]];
    left++;
    right--;
  }

  const result = Number(digits.join(""));
  // 检查是否超过 32 位有符号整数范围
  return result > 2 ** 31 - 1 ? -1 : result;
}

// 方法2：栈辅助 — 从右向左用栈找第一个升序
function nextGreaterElementIIIStack(n: number): number {
  const digits = String(n).split("").map(Number);
  const len = digits.length;
  const stack: number[] = []; // 存下标

  // 从右向左遍历，找第一个升序对
  let pivot = -1;
  for (let i = len - 1; i >= 0; i--) {
    while (stack.length > 0 && digits[i] < digits[stack[stack.length - 1]]) {
      pivot = stack.pop()!;
    }
    if (pivot !== -1 && digits[i] < digits[pivot]) {
      // 找到了，交换
      [digits[i], digits[pivot]] = [digits[pivot], digits[i]];
      // 反转 i+1 到末尾
      const suffix = digits.splice(i + 1);
      suffix.sort((a, b) => a - b);
      digits.push(...suffix);
      const result = Number(digits.join(""));
      return result > 2 ** 31 - 1 ? -1 : result;
    }
    stack.push(i);
  }

  return -1;
}

// 方法3：利用 next_permutation 通用模板
function nextGreaterElementIIITemplate(n: number): number {
  const chars = String(n).split("");

  // 标准 next_permutation 算法
  // 1. 找最大下标 i 使得 chars[i] < chars[i+1]
  let i = chars.length - 2;
  while (i >= 0 && chars[i] >= chars[i + 1]) i--;

  if (i < 0) return -1;

  // 2. 找最大下标 j 使得 chars[j] > chars[i]
  let j = chars.length - 1;
  while (chars[j] <= chars[i]) j--;

  // 3. 交换
  [chars[i], chars[j]] = [chars[j], chars[i]];

  // 4. 反转 i+1 到末尾
  for (let l = i + 1, r = chars.length - 1; l < r; l++, r--) {
    [chars[l], chars[r]] = [chars[r], chars[l]];
  }

  const result = parseInt(chars.join(""), 10);
  return result > 2 ** 31 - 1 ? -1 : result;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 括号匹配 =====");
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false
console.log(isValid("([)]")); // false
console.log(isValid("{[]}")); // true
console.log(isValidSwitch("()[]{}")); // true
console.log(isValidReplace("{[]}")); // true

console.log("\n===== 2. 最小栈 =====");
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin()); // -3
minStack.pop();
console.log(minStack.top()); // 0
console.log(minStack.getMin()); // -2

const minStackDiff = new MinStackDiff();
minStackDiff.push(-2);
minStackDiff.push(0);
minStackDiff.push(-3);
console.log(minStackDiff.getMin()); // -3
minStackDiff.pop();
console.log(minStackDiff.top()); // 0
console.log(minStackDiff.getMin()); // -2

console.log("\n===== 3. 栈的链式存储 =====");
const linkedStack = new LinkedStack<number>();
linkedStack.push(1);
linkedStack.push(2);
linkedStack.push(3);
console.log(linkedStack.toArray()); // [3, 2, 1]
console.log(linkedStack.peek()); // 3
console.log(linkedStack.pop()); // 3
console.log(linkedStack.toArray()); // [2, 1]
console.log(linkedStack.size()); // 2
console.log(linkedStack.isEmpty()); // false

console.log("\n===== 4. 逆波兰表达式求值 =====");
console.log(evalRPN(["2", "1", "+", "3", "*"])); // 9
console.log(evalRPN(["4", "13", "5", "/", "+"])); // 6
console.log(evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"])); // 22
console.log(evalRPNMap(["2", "1", "+", "3", "*"])); // 9
console.log(evalRPNRecursive(["4", "13", "5", "/", "+"])); // 6

console.log("\n===== 5. 表达式求值 =====");
console.log(calculate("3+2*2")); // 7
console.log(calculate(" 3/2 ")); // 1
console.log(calculate(" 3+5 / 2 ")); // 5
console.log(calculate("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculateAddSub("1 + 1")); // 2
console.log(calculateAddSub("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculatePostfix("3+2*2")); // 7

console.log("\n===== 6. 下一个更大元素 I =====");
console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // [-1, 3, -1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])); // [3, -1]
console.log(nextGreaterElementBruteForce([4, 1, 2], [1, 3, 4, 2])); // [-1, 3, -1]
console.log(nextGreaterElementRightToLeft([2, 4], [1, 2, 3, 4])); // [3, -1]

console.log("\n===== 7. 用栈实现队列 =====");
const queue = new MyQueue();
queue.push(1);
queue.push(2);
console.log(queue.peek()); // 1
console.log(queue.pop()); // 1
console.log(queue.empty()); // false

console.log("\n===== 8. 用队列实现栈 =====");
const stack = new MyStack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.top()); // 3
console.log(stack.pop()); // 3
console.log(stack.pop()); // 2
console.log(stack.empty()); // false

const stack2 = new MyStackTwoQueues();
stack2.push(1);
stack2.push(2);
console.log(stack2.top()); // 2
console.log(stack2.pop()); // 2
console.log(stack2.pop()); // 1
console.log(stack2.empty()); // true

console.log("\n===== 9. 下一个更大元素 II（循环数组） =====");
console.log(nextGreaterElements([1, 2, 1])); // [2, -1, 2]
console.log(nextGreaterElements([1, 2, 3, 4, 3])); // [2, 3, 4, -1, 4]
console.log(nextGreaterElementsConcat([1, 2, 1])); // [2, -1, 2]
console.log(nextGreaterElementsRightToLeft([1, 2, 3, 4, 3])); // [2, 3, 4, -1, 4]

console.log("\n===== 10. 下一个更大元素 III（给定一个正整数） =====");
console.log(nextGreaterElementIII(12)); // 21
console.log(nextGreaterElementIII(21)); // -1
console.log(nextGreaterElementIII(1234)); // 1243
console.log(nextGreaterElementIII(534976)); // 536479
console.log(nextGreaterElementIIIStack(534976)); // 536479
console.log(nextGreaterElementIIITemplate(1234)); // 1243

export {};
