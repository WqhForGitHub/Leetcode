// ============================================================
// 029. 删除无效的括号
// ============================================================
// LeetCode 301. Remove Invalid Parentheses
// 删除最少数量的无效括号，使输入字符串有效。返回所有可能的结果。
// 时间复杂度：O(2^n), 空间复杂度：O(n)

// 方法1：回溯(计数+去重) (推荐)
// 先计算需要删除的左括号和右括号数量，然后回溯搜索所有可能的删除方案
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function removeInvalidParentheses(s: string): string[] {
  // 计算需要删除的左括号和右括号数量
  let leftRemove: number = 0;
  let rightRemove: number = 0;
  for (const ch of s) {
    if (ch === "(") {
      leftRemove++;
    } else if (ch === ")") {
      if (leftRemove > 0) {
        // 有左括号可以匹配
        leftRemove--;
      } else {
        // 没有左括号匹配，这个右括号需要删除
        rightRemove++;
      }
    }
  }

  const result: Set<string> = new Set();

  // index: 当前处理的字符位置
  // leftCount: 当前路径中左括号数量
  // rightCount: 当前路径中右括号数量
  // leftRem: 还需要删除的左括号数量
  // rightRem: 还需要删除的右括号数量
  // path: 当前构建的字符串
  function backtrack(
    index: number,
    leftCount: number,
    rightCount: number,
    leftRem: number,
    rightRem: number,
    path: string,
  ): void {
    // 处理完所有字符
    if (index === s.length) {
      if (leftRem === 0 && rightRem === 0) {
        result.add(path);
      }
      return;
    }

    const ch: string = s[index];

    // 选择1：删除当前括号
    if (ch === "(" && leftRem > 0) {
      backtrack(index + 1, leftCount, rightCount, leftRem - 1, rightRem, path);
    } else if (ch === ")" && rightRem > 0) {
      backtrack(index + 1, leftCount, rightCount, leftRem, rightRem - 1, path);
    }

    // 选择2：保留当前字符
    if (ch === "(") {
      // 左括号总是可以保留
      backtrack(index + 1, leftCount + 1, rightCount, leftRem, rightRem, path + ch);
    } else if (ch === ")") {
      // 右括号只有在有未匹配的左括号时才保留
      if (leftCount > rightCount) {
        backtrack(index + 1, leftCount, rightCount + 1, leftRem, rightRem, path + ch);
      }
    } else {
      // 非括号字符直接保留
      backtrack(index + 1, leftCount, rightCount, leftRem, rightRem, path + ch);
    }
  }

  backtrack(0, 0, 0, leftRemove, rightRemove, "");
  return Array.from(result);
}

// 方法2：BFS(逐个删除)
// BFS逐层删除一个括号，第一次找到有效字符串的层即为最少删除数
// 时间复杂度 O(2^n), 空间复杂度 O(2^n)
function removeInvalidParenthesesBFS(s: string): string[] {
  // 检查字符串是否是有效的括号
  const isValid = (str: string): boolean => {
    let count: number = 0;
    for (const ch of str) {
      if (ch === "(") count++;
      else if (ch === ")") count--;
      if (count < 0) return false;
    }
    return count === 0;
  };

  const visited: Set<string> = new Set([s]);
  const queue: string[] = [s];
  const result: string[] = [];
  let found: boolean = false;

  while (queue.length > 0) {
    const curr: string = queue.shift()!;

    if (isValid(curr)) {
      result.push(curr);
      found = true;
    }

    // 如果已经找到有效结果，不再扩展（BFS保证最少删除）
    if (found) continue;

    // 尝试删除每个括号字符
    for (let i: number = 0; i < curr.length; i++) {
      if (curr[i] !== "(" && curr[i] !== ")") continue;
      const next: string = curr.substring(0, i) + curr.substring(i + 1);
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 删除无效的括号 =====");
console.log(removeInvalidParentheses("()())()")); // 期望结果: ["(())()","()()()"]
console.log(removeInvalidParentheses("(a)())()")); // 期望结果: ["(a())()","(a)()()"]
console.log(removeInvalidParentheses(")(")); // 期望结果: [""]
console.log(removeInvalidParenthesesBFS("()())()")); // 期望结果: ["(())()","()()()"]
console.log(removeInvalidParenthesesBFS("(a)())()")); // 期望结果: ["(a())()","(a)()()"]

export {};
