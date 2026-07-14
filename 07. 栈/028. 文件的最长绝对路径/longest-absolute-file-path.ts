// ============================================================
// 028. 文件的最长绝对路径
// ============================================================
// LeetCode 388. Longest Absolute File Path
// 给定一个字符串 input 表示文件系统中目录和文件的层次关系（\n 分隔，\t 表示深度），
// 返回其中最长的文件路径长度。若没有文件返回 0。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 用栈维护每一层的路径长度。遇到更深一层则基于栈顶累加，回退时弹栈。
// 时间 O(n)，空间 O(深度)。
function lengthLongestPath(input: string): number {
  const stack: number[] = [0]; // 栈顶为当前层路径总长度（含 /）
  let maxLen = 0;
  const parts = input.split("\n");
  for (const part of parts) {
    // 计算深度（\t 个数）
    let depth = 0;
    while (part[depth] === "\t") depth++;
    // 弹栈到当前深度对应的前驱
    while (stack.length > depth + 1) stack.pop();
    // 当前名字长度 = part.length - depth
    const curLen = stack[stack.length - 1] + (part.length - depth);
    if (part.includes(".")) {
      // 是文件
      maxLen = Math.max(maxLen, curLen);
    } else {
      // 是目录，加上 '/' 的长度入栈
      stack.push(curLen + 1);
    }
  }
  return maxLen;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", lengthLongestPath("dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"), "期望: 20");
  console.log(
    "测试2:",
    lengthLongestPath(
      "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext",
    ),
    "期望: 32",
  );
  console.log("测试3:", lengthLongestPath("a"), "期望: 0");
  console.log("测试4:", lengthLongestPath("file1.txt\nfile2.txt\nlongfile.txt"), "期望: 12");
}

test();

export {};
