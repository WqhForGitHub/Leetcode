// ============================================================
// 004. 简化路径
// ============================================================
// LeetCode 71. Simplify Path
// 给你一个字符串 path，表示一个 Unix 风格的绝对路径，返回其规范路径。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 按 '/' 分割字符串，遇到目录名入栈，遇到 '..' 弹栈，遇到 '.' 或空跳过。
// 最后用 '/' 拼接栈中元素。
// 时间 O(n)，空间 O(n)。
function simplifyPath(path: string): string {
  const stack: string[] = [];
  const parts = path.split('/');
  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    } else if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', simplifyPath('/home/'), '期望: /home');
  console.log('测试2:', simplifyPath('/../'), '期望: /');
  console.log('测试3:', simplifyPath('/home//foo/'), '期望: /home/foo');
  console.log('测试4:', simplifyPath('/a/./b/../../c/'), '期望: /c');
  console.log('测试5:', simplifyPath('/a/../../b/../c//.//'), '期望: /c');
}

test();

export {};
