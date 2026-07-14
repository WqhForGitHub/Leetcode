// ============================================================
// 073. 长度为 n 的开心字符串中字典序第 k 小的字符串
// ============================================================
// LeetCode 1415. The k-th Lexicographical String of All Happy Strings of Length n
// 开心字符串：仅由 'a','b','c' 组成，且相邻字符不同。给定 n 和 k，
// 返回长度为 n 的所有开心字符串中字典序第 k 小的字符串；若不足 k 个返回 ""。
// 总数 = 3 * 2^(n-1)。
// 时间复杂度：O(n)（数学法）或 O(k*n)（回溯法）。

// 方法1：回溯 (推荐)
// 按字典序枚举所有开心字符串，数到第 k 个即返回。
// 时间复杂度：O(k*n)，空间复杂度：O(n) 递归栈
function getHappyString1(n: number, k: number): string {
  const chars: string[] = ["a", "b", "c"];
  const path: string[] = [];
  let count: number = 0;
  let answer: string = "";

  const backtrack = (): boolean => {
    if (path.length === n) {
      count++;
      if (count === k) {
        answer = path.join("");
        return true;
      }
      return false;
    }
    for (const c of chars) {
      // 相邻字符不能相同
      if (path.length > 0 && path[path.length - 1] === c) continue;
      path.push(c);
      if (backtrack()) return true;
      path.pop();
    }
    return false;
  };

  backtrack();
  return answer;
}

// 方法2：数学(计算每层分支)
// 总数 = 3 * 2^(n-1)。若 k 超出范围直接返回 ""。
// 第 1 位有 3 个分支，后续每位有 2 个分支；按 k 确定每位的字符。
// 时间复杂度：O(n)，空间复杂度：O(n)
function getHappyString2(n: number, k: number): string {
  const total: number = 3 * Math.pow(2, n - 1);
  if (k > total) return ""; // 不存在第 k 个

  const chars: string[] = ["a", "b", "c"];
  let result: string = "";
  let prev: string = "";
  let kk: number = k - 1; // 转为 0-indexed

  for (let i: number = 0; i < n; i++) {
    // 当前位每个分支对应的子树大小
    const blockSize: number = Math.pow(2, n - 1 - i);
    // 候选字符：排除上一位
    const candidates: string[] = chars.filter((c: string) => c !== prev);
    const idx: number = Math.floor(kk / blockSize);
    const chosen: string = candidates[idx];
    result += chosen;
    prev = chosen;
    kk %= blockSize;
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 长度为 n 的开心字符串中字典序第 k 小的字符串 =====");
console.log(getHappyString1(1, 3)); // 期望结果: "c"
console.log(getHappyString1(3, 9)); // 期望结果: "cab"
console.log(getHappyString1(2, 7)); // 期望结果: "" (k > 3*2^(n-1)=6)
console.log(getHappyString1(10, 100)); // 期望结果: "abacbabacb"
console.log(getHappyString2(1, 3)); // 期望结果: "c"
console.log(getHappyString2(3, 9)); // 期望结果: "cab"
console.log(getHappyString2(2, 7)); // 期望结果: ""
console.log(getHappyString2(10, 100)); // 期望结果: "abacbabacb"

export {};
