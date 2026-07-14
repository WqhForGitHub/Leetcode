// ============================================================
// 133. 无重复字符串的排列组合
// ============================================================
// 面试金典 CCI 08.07. 无重复字符串的排列组合
// 给定一个字符均不相同的字符串，返回其所有排列。
// 时间复杂度：O(N*N!), 空间复杂度：O(N)

// 方法1：回溯+used (推荐)
// 用 used 数组标记已使用字符，回溯生成所有排列。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permutationsNoDup(s: string): string[] {
  const chars: string[] = s.split("");
  const n: number = chars.length;
  const result: string[] = [];
  const path: string[] = [];
  const used: boolean[] = new Array(n).fill(false);

  const backtrack = (): void => {
    if (path.length === n) {
      result.push(path.join(""));
      return;
    }
    for (let i: number = 0; i < n; i++) {
      if (used[i]) {
        continue;
      }
      used[i] = true;
      path.push(chars[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}

// 方法2：递归(固定第一个字符)
// 对每个字符作为首字符，递归求剩余字符的排列，再拼接。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permutationsNoDupRecur(s: string): string[] {
  const n: number = s.length;
  if (n === 0) {
    return [""];
  }
  const result: string[] = [];
  for (let i: number = 0; i < n; i++) {
    // 选第 i 个字符作为首字符
    const first: string = s[i];
    const rest: string = s.slice(0, i) + s.slice(i + 1);
    const subPerms: string[] = permutationsNoDupRecur(rest);
    for (const p of subPerms) {
      result.push(first + p);
    }
  }
  return result;
}

// 方法3：交换法
// 在原数组上交换元素，固定位置 index 的字符，递归处理后续位置。
// 时间复杂度 O(N*N!), 空间复杂度 O(N)
function permutationsNoDupSwap(s: string): string[] {
  const chars: string[] = s.split("");
  const n: number = chars.length;
  const result: string[] = [];

  const backtrack = (index: number): void => {
    if (index === n) {
      result.push(chars.join(""));
      return;
    }
    for (let i: number = index; i < n; i++) {
      // 交换 index 和 i
      [chars[index], chars[i]] = [chars[i], chars[index]];
      backtrack(index + 1);
      // 恢复
      [chars[index], chars[i]] = [chars[i], chars[index]];
    }
  };

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 133. 无重复字符串的排列组合 =====");
console.log(permutationsNoDup("abc"));
// 期望结果: ["abc","acb","bac","bca","cab","cba"]
console.log(permutationsNoDupRecur("abc"));
console.log(permutationsNoDupSwap("abc"));
console.log(permutationsNoDup("a")); // 期望结果: ["a"]

export {};
