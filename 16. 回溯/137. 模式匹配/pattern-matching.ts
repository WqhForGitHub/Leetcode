// ============================================================
// 137. 模式匹配
// ============================================================
// 面试金典 CCI 16.18. 模式匹配
// 给定模式串 pattern（仅含 'a' 和 'b'）和值 value，
// 判断 value 是否能由 pattern 匹配，其中 'a' 和 'b' 映射到不同的非空子串。
// 时间复杂度：O(N^2), 空间复杂度：O(N)

// 方法1：枚举a和b的长度+验证 (推荐)
// 设 a 出现 countA 次、b 出现 countB 次，a 长度 lenA、b 长度 lenB，
// 满足 countA*lenA + countB*lenB = value.length。枚举 lenA 求出 lenB 后验证。
// 时间复杂度 O(N^2), 空间复杂度 O(N)
function patternMatching(pattern: string, value: string): boolean {
  const n: number = value.length;
  const pLen: number = pattern.length;
  if (pLen === 0) {
    return n === 0;
  }
  // 统计 a、b 出现次数
  let countA: number = 0;
  let countB: number = 0;
  for (const ch of pattern) {
    if (ch === "a") countA++;
    else countB++;
  }

  // 情况1：只有 a
  if (countB === 0) {
    if (n % countA !== 0) return false;
    const lenA: number = n / countA;
    if (lenA < 1) return false; // a 必须非空
    const a: string = value.substring(0, lenA);
    let idx: number = 0;
    for (const _ch of pattern) {
      if (value.substring(idx, idx + lenA) !== a) return false;
      idx += lenA;
    }
    return true;
  }
  // 情况2：只有 b
  if (countA === 0) {
    if (n % countB !== 0) return false;
    const lenB: number = n / countB;
    if (lenB < 1) return false;
    const b: string = value.substring(0, lenB);
    let idx: number = 0;
    for (const _ch of pattern) {
      if (value.substring(idx, idx + lenB) !== b) return false;
      idx += lenB;
    }
    return true;
  }
  // 情况3：a 和 b 都存在，枚举 lenA
  for (let lenA: number = 1; lenA * countA <= n; lenA++) {
    const remaining: number = n - lenA * countA;
    if (remaining % countB !== 0) continue;
    const lenB: number = remaining / countB;
    if (lenB < 1) continue;
    // 取出 a、b 的值并验证整串
    let a: string = "";
    let b: string = "";
    let idx: number = 0;
    let ok: boolean = true;
    for (const ch of pattern) {
      if (ch === "a") {
        const seg: string = value.substring(idx, idx + lenA);
        if (a === "") a = seg;
        else if (seg !== a) {
          ok = false;
          break;
        }
        idx += lenA;
      } else {
        const seg: string = value.substring(idx, idx + lenB);
        if (b === "") b = seg;
        else if (seg !== b) {
          ok = false;
          break;
        }
        idx += lenB;
      }
    }
    if (ok && a !== b) return true;
  }
  return false;
}

// 方法2：回溯
// 按 pattern 顺序处理，第一次遇到 a/b 时尝试所有可能的子串长度并记录映射，
// 后续遇到时直接验证。回溯时清除映射。
// 时间复杂度 O(N^2), 空间复杂度 O(N)
function patternMatchingBacktrack(pattern: string, value: string): boolean {
  const n: number = value.length;
  const pLen: number = pattern.length;
  if (pLen === 0) {
    return n === 0;
  }
  let mapA: string | null = null;
  let mapB: string | null = null;

  const backtrack = (pIdx: number, vIdx: number): boolean => {
    // 模式与值同时结束则匹配成功
    if (pIdx === pLen) {
      return vIdx === n;
    }
    if (vIdx > n) {
      return false;
    }
    const ch: string = pattern[pIdx];
    if (ch === "a") {
      if (mapA !== null) {
        // 已确定 a，直接校验
        const len: number = mapA.length;
        if (vIdx + len > n) return false;
        if (value.substring(vIdx, vIdx + len) !== mapA) return false;
        return backtrack(pIdx + 1, vIdx + len);
      }
      // 第一次遇到 a，枚举所有可能长度
      for (let len: number = 1; vIdx + len <= n; len++) {
        const candidate: string = value.substring(vIdx, vIdx + len);
        if (mapB !== null && candidate === mapB) continue; // a、b 必须不同
        mapA = candidate;
        if (backtrack(pIdx + 1, vIdx + len)) return true;
        mapA = null;
      }
      return false;
    } else {
      // ch === 'b'
      if (mapB !== null) {
        const len: number = mapB.length;
        if (vIdx + len > n) return false;
        if (value.substring(vIdx, vIdx + len) !== mapB) return false;
        return backtrack(pIdx + 1, vIdx + len);
      }
      for (let len: number = 1; vIdx + len <= n; len++) {
        const candidate: string = value.substring(vIdx, vIdx + len);
        if (mapA !== null && candidate === mapA) continue;
        mapB = candidate;
        if (backtrack(pIdx + 1, vIdx + len)) return true;
        mapB = null;
      }
      return false;
    }
  };

  return backtrack(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 137. 模式匹配 =====");
console.log(patternMatching("aabab", "catcatgocatgo")); // 期望结果: true (a="cat", b="go")
console.log(patternMatchingBacktrack("aabab", "catcatgocatgo")); // 期望结果: true
console.log(patternMatching("a", "z")); // 期望结果: true
console.log(patternMatchingBacktrack("a", "z")); // 期望结果: true
console.log(patternMatching("ab", "xx")); // 期望结果: false (a、b 必须不同但 "x"="x")
console.log(patternMatchingBacktrack("ab", "xx")); // 期望结果: false
console.log(patternMatching("aa", "catcat")); // 期望结果: true
console.log(patternMatchingBacktrack("aa", "catcat")); // 期望结果: true

export {};
