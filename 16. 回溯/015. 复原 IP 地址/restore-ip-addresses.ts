// ============================================================
// 015. 复原 IP 地址
// ============================================================
// LeetCode 93. Restore IP Addresses
// 给定一个只包含数字的字符串，复原它并返回所有可能的 IP 地址格式。
// 每个整数在 0~255 之间，不能有前导零（除非是 "0" 本身）。
// 时间复杂度：O(3^4) = O(1)，空间复杂度：O(4) 递归栈

// 方法1：回溯法 (推荐)
// 逐段构建 IP 地址，每段取 1~3 位数字，递归直到 4 段都填满
// 时间复杂度 O(3^4) = O(1), 空间复杂度 O(4)
function restoreIpAddresses(s: string): string[] {
  const result: string[] = [];
  const n: number = s.length;

  // 回溯函数：startIndex 为当前处理的字符串位置，segments 为已构建的段
  function backtrack(startIndex: number, segments: string[]): void {
    // 如果已经凑够 4 段
    if (segments.length === 4) {
      // 如果字符串刚好用完，则是一个合法 IP
      if (startIndex === n) {
        result.push(segments.join("."));
      }
      return;
    }

    // 剪枝：剩余字符太多或太少，不可能凑成合法 IP
    const remaining: number = n - startIndex;
    if (remaining < 4 - segments.length || remaining > 3 * (4 - segments.length)) {
      return;
    }

    // 尝试取 1~3 位数字作为一段
    for (let len = 1; len <= 3; len++) {
      if (startIndex + len > n) break; // 超出字符串范围
      const segment: string = s.substring(startIndex, startIndex + len);
      // 检查合法性：不能有前导零（除非是 "0"），且值 <= 255
      if (segment.length > 1 && segment[0] === "0") continue;
      if (parseInt(segment, 10) > 255) continue;
      segments.push(segment);
      backtrack(startIndex + len, segments);
      segments.pop();
    }
  }

  backtrack(0, []);
  return result;
}

// 方法2：三重循环枚举四段长度
// IP 有 4 段，每段 1~3 位，用三重循环枚举前三段的长度，第四段为剩余部分
// 时间复杂度 O(3^3) = O(1), 空间复杂度 O(1)
function restoreIpAddresses2(s: string): string[] {
  const result: string[] = [];
  const n: number = s.length;
  if (n < 4 || n > 12) return result;

  // 验证某段是否合法
  function isValid(segment: string): boolean {
    if (segment.length === 0 || segment.length > 3) return false;
    if (segment.length > 1 && segment[0] === "0") return false;
    return parseInt(segment, 10) <= 255;
  }

  // 三重循环枚举前三段的长度
  for (let i = 1; i <= 3 && i < n; i++) {
    for (let j = 1; j <= 3 && i + j < n; j++) {
      for (let k = 1; k <= 3 && i + j + k < n; k++) {
        const s1: string = s.substring(0, i);
        const s2: string = s.substring(i, i + j);
        const s3: string = s.substring(i + j, i + j + k);
        const s4: string = s.substring(i + j + k);
        if (isValid(s1) && isValid(s2) && isValid(s3) && isValid(s4)) {
          result.push(`${s1}.${s2}.${s3}.${s4}`);
        }
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 复原 IP 地址 =====");
console.log(restoreIpAddresses("25525511135")); // 期望结果: ["255.255.11.135","255.255.111.35"]
console.log(restoreIpAddresses("0000")); // 期望结果: ["0.0.0.0"]
console.log(restoreIpAddresses("101023")); // 期望结果: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
console.log(restoreIpAddresses2("25525511135")); // 期望结果: ["255.255.11.135","255.255.111.35"]
console.log(restoreIpAddresses2("0000")); // 期望结果: ["0.0.0.0"]

export {};
