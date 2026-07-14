// ============================================================
// 052. 模糊坐标
// ============================================================
// LeetCode 816. Ambiguous Coordinates
// 给定形如 "(s)" 的字符串，将其还原为所有可能的合法坐标 "(x, y)"。
// 在 s 中插入逗号分隔 x 和 y，再在每个数中可插入小数点，但不能有非法的前导/尾随零。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(先切分x/y,再切分小数点) (推荐)
// 先枚举逗号位置将原串切成两部分；对每部分枚举小数点位置，过滤非法格式。
// 时间复杂度 O(n^3), 空间复杂度 O(n^2) 结果存储
function ambiguousCoordinates(s: string): string[] {
  // 去掉首尾括号
  const inner = s.substring(1, s.length - 1);
  const n = inner.length;
  const result: string[] = [];

  // 判断一个加了小数点的数字是否合法
  // left: 小数点前的部分, right: 小数点后的部分（可为空表示无小数点）
  const isValid = (left: string, right: string): boolean => {
    // 整数部分：不能有前导零，除非本身是0
    if (left.length > 1 && left[0] === "0") return false;
    // 小数部分：不能以0结尾（避免0.10这种）
    if (right.length > 0 && right[right.length - 1] === "0") return false;
    return true;
  };

  // 对一段数字字符串生成所有合法的数字表示
  const generate = (str: string): string[] => {
    const res: string[] = [];
    // 不加小数点
    if (isValid(str, "")) res.push(str);
    // 加小数点：枚举小数点位置（i=1..n-1）
    for (let i = 1; i < str.length; i++) {
      const left = str.substring(0, i);
      const right = str.substring(i);
      if (isValid(left, right)) res.push(`${left}.${right}`);
    }
    return res;
  };

  // 枚举逗号位置：1 <= i <= n-1
  for (let i = 1; i < n; i++) {
    const xStr = inner.substring(0, i);
    const yStr = inner.substring(i);
    const xList = generate(xStr);
    const yList = generate(yStr);
    for (const x of xList) {
      for (const y of yList) {
        result.push(`(${x}, ${y})`);
      }
    }
  }
  return result;
}

// 方法2：枚举
// 类似方法1，但用循环枚举，逻辑结构稍微不同，便于理解。
// 时间复杂度 O(n^3), 空间复杂度 O(n^2)
function ambiguousCoordinatesEnumerate(s: string): string[] {
  const inner = s.substring(1, s.length - 1);
  const n = inner.length;
  const result: string[] = [];

  // 生成单段字符串的所有合法数字
  const possibleNums = (str: string): string[] => {
    const res: string[] = [];
    const len = str.length;
    // 整数形式
    if (len === 1 || str[0] !== "0") res.push(str);
    // 小数形式
    for (let i = 1; i < len; i++) {
      const intPart = str.substring(0, i);
      const decPart = str.substring(i);
      // 整数部分不能有前导零（除非是"0"）
      if (intPart.length > 1 && intPart[0] === "0") continue;
      // 小数部分不能以0结尾
      if (decPart[decPart.length - 1] === "0") continue;
      res.push(`${intPart}.${decPart}`);
    }
    return res;
  };

  for (let i = 1; i < n; i++) {
    const xs = possibleNums(inner.substring(0, i));
    const ys = possibleNums(inner.substring(i));
    for (const x of xs) {
      for (const y of ys) {
        result.push(`(${x}, ${y})`);
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 模糊坐标 =====");
console.log(ambiguousCoordinates("(123)")); // 期望结果: ["(1, 2.3)","(1, 23)","(1.2, 3)","(12, 3)"]
console.log(ambiguousCoordinates("(0123)")); // 期望结果: ["(0, 123)","(0, 12.3)","(0, 1.23)","(0.1, 23)","(0.1, 2.3)","(0.12, 3)"]
console.log(ambiguousCoordinatesEnumerate("(123)")); // 期望结果: ["(1, 2.3)","(1, 23)","(1.2, 3)","(12, 3)"]

export {};
