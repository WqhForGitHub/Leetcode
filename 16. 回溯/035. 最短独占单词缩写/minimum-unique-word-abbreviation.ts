// ============================================================
// 035. 最短独占单词缩写
// ============================================================
// LeetCode 411. Minimum Unique Word Abbreviation
// 给定目标词和字典，找到目标词的最短缩写，使该缩写不匹配字典中任何词。
// 使用位掩码表示保留/缩写位置，高效判断冲突。
// 时间复杂度：O(2^m * n), 空间复杂度：O(n)，其中m为目标词长度，n为字典大小

// 方法1：回溯+位掩码 (推荐)
// 用位掩码表示哪些位置保留(1)哪些位置缩写(0)。回溯搜索所有掩码，
// 找到不匹配任何字典词的最短缩写。
// 时间复杂度 O(2^m * n), 空间复杂度 O(n)
function minAbbreviation(target: string, dictionary: string[]): string {
  const m: number = target.length;

  // 过滤出长度相同的字典词（长度不同不会匹配）
  const dict: string[] = dictionary.filter((w: string) => w.length === m);
  if (dict.length === 0) {
    return m.toString(); // 没有同长度的字典词，全缩写即可
  }

  // 计算每个字典词与target的差异掩码
  // diff[i]的第j位为1表示target[j] != dict[i][j]
  const diffs: number[] = dict.map((w: string) => {
    let d: number = 0;
    for (let i: number = 0; i < m; i++) {
      if (w[i] !== target[i]) d |= 1 << i;
    }
    return d;
  });

  // 计算掩码对应的缩写长度
  function abbrLen(mask: number): number {
    let len: number = 0;
    let count: number = 0;
    for (let i: number = 0; i < m; i++) {
      if (mask & (1 << i)) {
        // 保留字符：+1
        len++;
        if (count > 0) {
          len += count.toString().length;
          count = 0;
        }
      } else {
        count++;
      }
    }
    if (count > 0) len += count.toString().length;
    return len;
  }

  let bestLen: number = m; // 最坏情况：全保留
  let bestMask: number = (1 << m) - 1;

  // 回溯：逐位决定保留(1)或缩写(0)
  function backtrack(pos: number, mask: number): void {
    if (pos === m) {
      // 检查是否与所有字典词都不同
      // 缩写匹配字典词的条件：所有保留位置字符相同，即 mask & diff == 0
      for (const d of diffs) {
        if ((mask & d) === 0) return; // 匹配了某个字典词，不合法
      }
      const len: number = abbrLen(mask);
      if (len < bestLen || (len === bestLen && mask < bestMask)) {
        bestLen = len;
        bestMask = mask;
      }
      return;
    }

    // 选择1：保留位置pos
    backtrack(pos + 1, mask | (1 << pos));
    // 选择2：缩写位置pos
    backtrack(pos + 1, mask);
  }

  backtrack(0, 0);

  // 根据最优掩码生成缩写字符串
  let result: string = "";
  let count: number = 0;
  for (let i: number = 0; i < m; i++) {
    if (bestMask & (1 << i)) {
      if (count > 0) {
        result += count;
        count = 0;
      }
      result += target[i];
    } else {
      count++;
    }
  }
  if (count > 0) result += count;
  return result;
}

// 方法2：枚举所有缩写+验证
// 枚举所有2^m种掩码，计算缩写长度，验证是否独占，取最短
// 时间复杂度 O(2^m * n), 空间复杂度 O(n)
function minAbbreviation2(target: string, dictionary: string[]): string {
  const m: number = target.length;
  const dict: string[] = dictionary.filter((w: string) => w.length === m);
  if (dict.length === 0) return m.toString();

  // 计算差异掩码
  const diffs: number[] = dict.map((w: string) => {
    let d: number = 0;
    for (let i: number = 0; i < m; i++) {
      if (w[i] !== target[i]) d |= 1 << i;
    }
    return d;
  });

  // 计算缩写长度
  function abbrLen(mask: number): number {
    let len: number = 0;
    let count: number = 0;
    for (let i: number = 0; i < m; i++) {
      if (mask & (1 << i)) {
        len++;
        if (count > 0) {
          len += count.toString().length;
          count = 0;
        }
      } else {
        count++;
      }
    }
    if (count > 0) len += count.toString().length;
    return len;
  }

  // 生成缩写字符串
  function abbrStr(mask: number): string {
    let s: string = "";
    let count: number = 0;
    for (let i: number = 0; i < m; i++) {
      if (mask & (1 << i)) {
        if (count > 0) {
          s += count;
          count = 0;
        }
        s += target[i];
      } else {
        count++;
      }
    }
    if (count > 0) s += count;
    return s;
  }

  let bestLen: number = m;
  let bestMask: number = (1 << m) - 1;

  // 枚举所有掩码
  for (let mask: number = 0; mask < 1 << m; mask++) {
    // 检查是否独占
    let valid: boolean = true;
    for (const d of diffs) {
      if ((mask & d) === 0) {
        valid = false;
        break;
      }
    }
    if (valid) {
      const len: number = abbrLen(mask);
      if (len < bestLen) {
        bestLen = len;
        bestMask = mask;
      }
    }
  }

  return abbrStr(bestMask);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 最短独占单词缩写 =====");
console.log(minAbbreviation("apple", ["blade", "plain", "amber"])); // 期望结果: "1p3" (或其他长度为3的合法缩写)
console.log(minAbbreviation2("apple", ["blade", "plain", "amber"])); // 期望结果: 同上
console.log(minAbbreviation("hi", ["hello"])); // 期望结果: "2" (无同长度字典词)

export {};
