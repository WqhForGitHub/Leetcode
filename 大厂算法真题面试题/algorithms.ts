// ============================================================
// 大厂算法真题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 1. 升序数组中和为给定值的两个数字
// LeetCode 167. Two Sum II - Input Array Is Sorted
// ============================================================

// 方法1：双指针法（推荐）
// 时间复杂度 O(n)，空间复杂度 O(1)
function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 题目要求返回 1-indexed
    } else if (sum < target) {
      left++; // 和太小，左指针右移
    } else {
      right--; // 和太大，右指针左移
    }
  }

  return [-1, -1]; // 未找到
}

// 方法2：二分查找法
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function twoSumSortedBinarySearch(numbers: number[], target: number): number[] {
  const n = numbers.length;

  for (let i = 0; i < n; i++) {
    const complement = target - numbers[i];
    // 在 i+1..n-1 范围内二分查找 complement
    let lo = i + 1;
    let hi = n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (numbers[mid] === complement) {
        return [i + 1, mid + 1];
      } else if (numbers[mid] < complement) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }

  return [-1, -1];
}

// 方法3：哈希表法
// 时间复杂度 O(n)，空间复杂度 O(n)
function twoSumSortedHashMap(numbers: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    if (map.has(complement)) {
      return [map.get(complement)! + 1, i + 1];
    }
    map.set(numbers[i], i);
  }

  return [-1, -1];
}

// ============================================================
// 2. 简单表达式求值
// 包含 +、-、*、/ 和非负整数，不含括号
// ============================================================

// 方法1：栈方法（推荐）
// 时间复杂度 O(n)，空间复杂度 O(n)
// 思路：先处理乘除法，将结果入栈，最后统一处理加法
function calculateSimple(s: string): number {
  const stack: number[] = [];
  let num = 0;
  let sign = "+"; // 前一个运算符，初始化为 +

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= "0" && ch <= "9") {
      num = num * 10 + parseInt(ch); // 解析多位数字
    }

    // 当前字符是运算符或到达末尾时，处理前一个运算符
    if (((ch < "0" || ch > "9") && ch !== " ") || i === s.length - 1) {
      switch (sign) {
        case "+":
          stack.push(num); // 加法：直接入栈
          break;
        case "-":
          stack.push(-num); // 减法：取反入栈
          break;
        case "*":
          stack.push(stack.pop()! * num); // 乘法：与栈顶相乘
          break;
        case "/":
          stack.push(Math.trunc(stack.pop()! / num)); // 除法：与栈顶相除，向零取整
          break;
      }
      sign = ch; // 更新运算符
      num = 0; // 重置数字
    }
  }

  // 栈中所有元素求和即为结果
  return stack.reduce((sum, val) => sum + val, 0);
}

// 方法2：一次遍历法（无栈）
// 时间复杂度 O(n)，空间复杂度 O(1)
// 思路：用变量记录当前累加结果和待处理的乘除项
function calculateSimpleNoStack(s: string): number {
  let result = 0; // 最终结果
  let cur = 0; // 当前数字
  let prev = 0; // 上一个待处理的乘除项
  let sign = "+"; // 前一个运算符

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= "0" && ch <= "9") {
      cur = cur * 10 + parseInt(ch);
    }

    if (((ch < "0" || ch > "9") && ch !== " ") || i === s.length - 1) {
      if (sign === "+") {
        result += prev; // 将上一个乘除项加入结果
        prev = cur; // 开始新的乘除项
      } else if (sign === "-") {
        result += prev;
        prev = -cur; // 负数乘除项
      } else if (sign === "*") {
        prev = prev * cur; // 乘法直接合并到当前项
      } else if (sign === "/") {
        prev = Math.trunc(prev / cur); // 除法直接合并到当前项
      }
      sign = ch;
      cur = 0;
    }
  }

  return result + prev; // 加上最后一个乘除项
}

// 方法3：先转后缀表达式（逆波兰式）再求值
// 时间复杂度 O(n)，空间复杂度 O(n)
// 思路：中缀 → 后缀（调度场算法）→ 求值
function calculateSimplePostfix(s: string): number {
  // 第一步：中缀转后缀（调度场算法）
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

  let i = 0;
  while (i < s.length) {
    const ch = s[i];

    if (ch === " ") {
      i++;
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      let num = "";
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        num += s[i];
        i++;
      }
      output.push(num);
      continue;
    }

    // 当前运算符优先级 <= 栈顶运算符优先级时，弹出栈顶
    while (
      ops.length > 0 &&
      precedence[ops[ops.length - 1]] >= precedence[ch]
    ) {
      output.push(ops.pop()!);
    }
    ops.push(ch);
    i++;
  }

  // 弹出剩余运算符
  while (ops.length > 0) {
    output.push(ops.pop()!);
  }

  // 第二步：对后缀表达式求值
  const stack: number[] = [];
  for (const token of output) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(Math.trunc(a / b));
          break;
      }
    } else {
      stack.push(parseInt(token));
    }
  }

  return stack[0];
}

// ============================================================
// 测试
// ============================================================

// --- 测试用例 ---

console.log("===== 1. 升序数组中和为给定值的两个数字 =====");
console.log(twoSumSorted([2, 7, 11, 15], 9)); // [1, 2]
console.log(twoSumSorted([2, 3, 4], 6)); // [1, 3]
console.log(twoSumSorted([-1, 0], -1)); // [1, 2]
console.log(twoSumSortedBinarySearch([2, 7, 11, 15], 9)); // [1, 2]
console.log(twoSumSortedBinarySearch([2, 3, 4], 6)); // [1, 3]
console.log(twoSumSortedHashMap([2, 7, 11, 15], 9)); // [1, 2]
console.log(twoSumSortedHashMap([-1, 0], -1)); // [1, 2]

console.log("\n===== 2. 简单表达式求值 =====");
console.log(calculateSimple("3+2*2")); // 7
console.log(calculateSimple(" 3/2 ")); // 1
console.log(calculateSimple(" 3+5 / 2 ")); // 5
console.log(calculateSimple("14-3/2")); // 13
console.log(calculateSimpleNoStack("3+2*2")); // 7
console.log(calculateSimpleNoStack(" 3/2 ")); // 1
console.log(calculateSimpleNoStack(" 3+5 / 2 ")); // 5
console.log(calculateSimpleNoStack("14-3/2")); // 13
console.log(calculateSimplePostfix("3+2*2")); // 7
console.log(calculateSimplePostfix(" 3/2 ")); // 1
console.log(calculateSimplePostfix(" 3+5 / 2 ")); // 5
console.log(calculateSimplePostfix("14-3/2")); // 13

export {};
