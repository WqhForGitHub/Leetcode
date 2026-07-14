// ============================================================
// 124. 复原 IP 地址
// ============================================================
// 面试金典 08.09 进阶 / LeetCode 93. Restore IP Addresses
// 给定纯数字字符串，复原所有可能的合法 IPv4 地址（4 段）。

// 时间复杂度：O(1)（字符串长度固定为 3..12，常数级）
// 空间复杂度：O(1)

// 判断一段是否合法 IP 段：0..255，无前导 0（除非就是 "0"）
function isValidSegment(seg: string): boolean {
  if (seg.length === 0 || seg.length > 3) return false;
  if (seg.length > 1 && seg[0] === "0") return false; // 前导 0
  const val: number = parseInt(seg, 10);
  return val >= 0 && val <= 255;
}

// 方法1：回溯
// 按段切分，每段取 1..3 位，递归直到 4 段且用完所有字符。
// 时间复杂度 O(常数), 空间复杂度 O(1)
function restoreIpAddresses(s: string): string[] {
  const result: string[] = [];
  const segments: string[] = [];
  const n: number = s.length;

  function backtrack(start: number): void {
    // 剪枝：剩余字符过多或过少
    const remain: number = n - start;
    const need: number = 4 - segments.length;
    if (remain < need || remain > need * 3) return;

    if (segments.length === 4) {
      if (start === n) result.push(segments.join("."));
      return;
    }
    for (let len: number = 1; len <= 3 && start + len <= n; len++) {
      const seg: string = s.substring(start, start + len);
      if (isValidSegment(seg)) {
        segments.push(seg);
        backtrack(start + len);
        segments.pop();
      }
    }
  }

  backtrack(0);
  return result;
}

// 方法2：三重循环
// 直接枚举前三段切分点（第四段为剩余），判断四段全合法即可。
// 时间复杂度 O(常数), 空间复杂度 O(1)
function restoreIpAddresses2(s: string): string[] {
  const result: string[] = [];
  const n: number = s.length;
  if (n < 4 || n > 12) return result;

  for (let i: number = 1; i <= 3 && i < n; i++) {
    for (let j: number = i + 1; j <= i + 3 && j < n; j++) {
      for (let k: number = j + 1; k <= j + 3 && k < n; k++) {
        const a: string = s.substring(0, i);
        const b: string = s.substring(i, j);
        const c: string = s.substring(j, k);
        const d: string = s.substring(k);
        if (d.length === 0 || d.length > 3) continue;
        if (isValidSegment(a) && isValidSegment(b) && isValidSegment(c) && isValidSegment(d)) {
          result.push(a + "." + b + "." + c + "." + d);
        }
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 124. 复原 IP 地址 =====");
console.log(restoreIpAddresses("25525511135"));
// 期望: ["255.255.11.135","255.255.111.35"]
console.log(restoreIpAddresses2("25525511135"));
console.log(restoreIpAddresses("0000")); // 期望: ["0.0.0.0"]
console.log(restoreIpAddresses2("0000"));
console.log(restoreIpAddresses("101023")); // 多个合法地址

export {};
