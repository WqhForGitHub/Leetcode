// ============================================================
// 026. 给表达式添加运算符
// ============================================================
// LeetCode 282. Expression Add Operators
// 给定数字字符串 num 和目标值 target，在数字之间添加 +、-、* 运算符，使表达式结果等于 target。返回所有可能表达式。
// 时间复杂度：O(4^N)，空间复杂度：O(N)

// 方法1：回溯（处理乘法优先级） (推荐)
// 回溯枚举每个位置添加运算符或不添加（多位数），维护当前表达式值和上一个操作数
// 乘法需要特殊处理：需要回退上一个操作数的值
// 时间复杂度 O(4^N), 空间复杂度 O(N) 递归栈
function addOperators(num: string, target: number): string[] {
  const result: string[] = [];
  const n: number = num.length;
  if (n === 0) return result;

  // 回溯函数
  // index: 当前处理的数字位置
  // expr: 当前表达式字符串
  // value: 当前表达式的计算值
  // prevOperand: 上一个操作数的值（用于乘法回退）
  function backtrack(index: number, expr: string, value: number, prevOperand: number): void {
    // 到达末尾，检查是否等于目标值
    if (index === n) {
      if (value === target) {
        result.push(expr);
      }
      return;
    }

    // 尝试截取不同长度的数字（1~剩余长度）
    for (let j = index + 1; j <= n; j++) {
      const numStr: string = num.substring(index, j);
      // 前导零检查：如果长度大于1且以0开头，不合法
      if (numStr.length > 1 && numStr[0] === "0") break;

      const currNum: number = parseInt(numStr, 10);

      // 如果是第一个数字，前面不能有运算符
      if (index === 0) {
        backtrack(j, numStr, currNum, currNum);
      } else {
        // 加法
        backtrack(j, expr + "+" + numStr, value + currNum, currNum);
        // 减法
        backtrack(j, expr + "-" + numStr, value - currNum, -currNum);
        // 乘法：需要回退上一个操作数
        // value = (value - prevOperand) + prevOperand * currNum
        backtrack(
          j,
          expr + "*" + numStr,
          value - prevOperand + prevOperand * currNum,
          prevOperand * currNum,
        );
      }
    }
  }

  backtrack(0, "", 0, 0);
  return result;
}

// 方法2：回溯 + 字符串构建（使用数组构建表达式）
// 与方法1类似，但使用数组构建表达式，避免字符串拼接
// 时间复杂度 O(4^N), 空间复杂度 O(N)
function addOperators2(num: string, target: number): string[] {
  const result: string[] = [];
  const n: number = num.length;
  if (n === 0) return result;

  const expr: string[] = [];

  function backtrack(index: number, value: number, prevOperand: number): void {
    if (index === n) {
      if (value === target) {
        result.push(expr.join(""));
      }
      return;
    }

    for (let j = index + 1; j <= n; j++) {
      const numStr: string = num.substring(index, j);
      if (numStr.length > 1 && numStr[0] === "0") break;

      const currNum: number = parseInt(numStr, 10);

      if (index === 0) {
        expr.push(numStr);
        backtrack(j, currNum, currNum);
        expr.pop();
      } else {
        // 加法
        expr.push("+" + numStr);
        backtrack(j, value + currNum, currNum);
        expr.pop();

        // 减法
        expr.push("-" + numStr);
        backtrack(j, value - currNum, -currNum);
        expr.pop();

        // 乘法
        expr.push("*" + numStr);
        backtrack(j, value - prevOperand + prevOperand * currNum, prevOperand * currNum);
        expr.pop();
      }
    }
  }

  backtrack(0, 0, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 给表达式添加运算符 =====");
console.log(addOperators("123", 6)); // 期望结果: ["1*2*3","1+2+3"]
console.log(addOperators2("123", 6)); // 期望结果: ["1*2*3","1+2+3"]
console.log(addOperators("105", 5)); // 期望结果: ["1*0+5","10-5"]
console.log(addOperators2("105", 5)); // 期望结果: ["1*0+5","10-5"]
console.log(addOperators("00", 0)); // 期望结果: ["0*0","0+0","0-0"]
console.log(addOperators("3456237490", 9191)); // 期望结果: []

export {};
