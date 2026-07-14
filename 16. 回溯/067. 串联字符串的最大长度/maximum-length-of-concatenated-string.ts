// ============================================================
// 067. 串联字符串的最大长度
// ============================================================
// LeetCode 1239. Maximum Length of a Concatenated String with Unique Characters
// 给定字符串数组，每个字符串最多使用一次，构造一个字符唯一的串联字符串，求最大长度。
// 时间复杂度：O(2^N * L), 空间复杂度：O(N)

// 方法1：回溯 + 位掩码 (推荐)
// 用 26 位整数表示字符出现情况，按位 OR 合并并检查冲突
// 时间复杂度 O(2^N * L), 空间复杂度 O(N)
function maxLength(arr: string[]): number {
  // 预处理：过滤自身含重复字符的串，并转为位掩码
  const masks: number[] = [];
  for (const s of arr) {
    let mask = 0;
    let ok = true;
    for (const ch of s) {
      const bit = 1 << (ch.charCodeAt(0) - 97);
      if (mask & bit) {
        ok = false;
        break;
      }
      mask |= bit;
    }
    if (ok) masks.push(mask);
  }

  let best = 0;

  const backtrack = (idx: number, cur: number, len: number): void => {
    if (idx === masks.length) {
      if (len > best) best = len;
      return;
    }
    // 不选当前
    backtrack(idx + 1, cur, len);
    // 选当前（若无冲突）
    if ((cur & masks[idx]) === 0) {
      backtrack(idx + 1, cur | masks[idx], len + popcount(masks[idx]));
    }
  };

  backtrack(0, 0, 0);
  return best;
}

// 计算二进制中 1 的位数
function popcount(x: number): number {
  let c = 0;
  while (x) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}

// 方法2：回溯 + 集合
// 用 Set<char> 表示当前已用字符，递归选择
// 时间复杂度 O(2^N * L), 空间复杂度 O(N * L)
function maxLength2(arr: string[]): number {
  // 过滤自身含重复字符的串
  const filtered: string[] = [];
  for (const s of arr) {
    const set = new Set<string>();
    let ok = true;
    for (const ch of s) {
      if (set.has(ch)) {
        ok = false;
        break;
      }
      set.add(ch);
    }
    if (ok) filtered.push(s);
  }

  let best = 0;

  const backtrack = (idx: number, used: Set<string>, len: number): void => {
    if (idx === filtered.length) {
      if (len > best) best = len;
      return;
    }
    // 不选
    backtrack(idx + 1, used, len);
    // 选：检查无冲突
    const s = filtered[idx];
    let canChoose = true;
    for (const ch of s) {
      if (used.has(ch)) {
        canChoose = false;
        break;
      }
    }
    if (canChoose) {
      const added: string[] = [];
      for (const ch of s) {
        used.add(ch);
        added.push(ch);
      }
      backtrack(idx + 1, used, len + s.length);
      for (const ch of added) used.delete(ch);
    }
  };

  backtrack(0, new Set<string>(), 0);
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 串联字符串的最大长度 =====");
console.log(maxLength(["un", "iq", "ue"])); // 期望结果: 4
console.log(maxLength(["cha", "r", "act", "ers"])); // 期望结果: 6
console.log(maxLength(["abcdefghijklmnopqrstuvwxyz"])); // 期望结果: 26
console.log(maxLength2(["un", "iq", "ue"])); // 期望结果: 4
console.log(maxLength2(["cha", "r", "act", "ers"])); // 期望结果: 6

export {};
