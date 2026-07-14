// ============================================================
// 061. 计算有效表达式
// ============================================================
// LeetCode 282. Expression Add Operators（计数版本）
// 给定一个只包含数字的字符串 s 和一个目标值 target，
// 通过在数字之间插入 '+'、'-' 或 '*' 形成表达式（允许组成多位数，
// 但不允许前导零，如 "05" 非法）。统计求值结果等于 target 的表达式数目。
// 时间复杂度：方法1 O(n^2 * V)，方法2 O(4^n)，其中 V 为子串可产生的不同值数

// 方法1：分治递归 + 记忆化（推荐）
// 对子串 s[start..end]，递归计算其所有可能取值 -> 出现次数的映射。
// 取值方式分两类：
//   1) 整段作为一个多位数（无前导零）：直接得到一个值；
//   2) 在某个位置 i 处切开，左侧 s[start..i] 与右侧 s[i+1..end] 各自递归，
//      再用 +、-、* 组合两侧所有取值。
// 用 memo[(start,end)] 缓存映射，避免重复计算。
function countValidExpressions1(s: string, target: number): number {
  const n: number = s.length;
  // 记忆化：key = start * n + end，value = Map<取值, 出现次数>
  const memo: Map<number, Map<number, number>> = new Map();

  const solve = (start: number, end: number): Map<number, number> => {
    if (start > end) return new Map<number, number>();
    const key: number = start * n + end;
    const cached: Map<number, number> | undefined = memo.get(key);
    if (cached !== undefined) return cached;

    const result: Map<number, number> = new Map();

    // 方式1：整段作为多位数（不允许前导零，单字符 '0' 合法）
    if (s.charCodeAt(start) !== 48 || start === end) {
      let num: number = 0;
      for (let i: number = start; i <= end; i++) {
        num = num * 10 + (s.charCodeAt(i) - 48);
      }
      result.set(num, 1);
    }

    // 方式2：在每个位置 i 切开并施加运算符
    for (let i: number = start; i < end; i++) {
      const leftMap: Map<number, number> = solve(start, i);
      const rightMap: Map<number, number> = solve(i + 1, end);
      leftMap.forEach((lc: number, lv: number): void => {
        rightMap.forEach((rc: number, rv: number): void => {
          // 加法
          const sp: number = lv + rv;
          result.set(sp, (result.get(sp) || 0) + lc * rc);
          // 减法
          const sm: number = lv - rv;
          result.set(sm, (result.get(sm) || 0) + lc * rc);
          // 乘法
          const mu: number = lv * rv;
          result.set(mu, (result.get(mu) || 0) + lc * rc);
        });
      });
    }

    memo.set(key, result);
    return result;
  };

  const full: Map<number, number> = solve(0, n - 1);
  return full.get(target) || 0;
}

// 方法2：分治递归（无记忆化）
// 思路与方法1一致，但不缓存结果，每个子问题重复求解，
// 复杂度退化为指数级 O(4^n)，仅适用于很短的字符串。
function countValidExpressions2(s: string, target: number): number {
  const n: number = s.length;

  const solve = (start: number, end: number): Map<number, number> => {
    const result: Map<number, number> = new Map();
    if (start > end) return result;

    // 整段作为多位数
    if (s.charCodeAt(start) !== 48 || start === end) {
      let num: number = 0;
      for (let i: number = start; i <= end; i++) {
        num = num * 10 + (s.charCodeAt(i) - 48);
      }
      result.set(num, 1);
    }

    // 在每个位置切开施加运算符
    for (let i: number = start; i < end; i++) {
      const leftMap: Map<number, number> = solve(start, i);
      const rightMap: Map<number, number> = solve(i + 1, end);
      leftMap.forEach((lc: number, lv: number): void => {
        rightMap.forEach((rc: number, rv: number): void => {
          const sp: number = lv + rv;
          result.set(sp, (result.get(sp) || 0) + lc * rc);
          const sm: number = lv - rv;
          result.set(sm, (result.get(sm) || 0) + lc * rc);
          const mu: number = lv * rv;
          result.set(mu, (result.get(mu) || 0) + lc * rc);
        });
      });
    }

    return result;
  };

  const full: Map<number, number> = solve(0, n - 1);
  return full.get(target) || 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 计算有效表达式 =====");
console.log('方法1 s="123" target=6:', countValidExpressions1("123", 6)); // 期望: 2 (1+2+3, 1*2*3)
console.log('方法2 s="123" target=6:', countValidExpressions2("123", 6)); // 期望: 2
console.log('方法1 s="232" target=8:', countValidExpressions1("232", 8)); // 期望: 2 (2+3*2, 2*3+2)
console.log('方法2 s="232" target=8:', countValidExpressions2("232", 8)); // 期望: 2
console.log('方法1 s="105" target=5:', countValidExpressions1("105", 5)); // 期望: 2 (1*0+5, 10-5；前导零的 05 非法)
console.log('方法2 s="105" target=5:', countValidExpressions2("105", 5)); // 期望: 2
console.log('方法1 s="0" target=0:', countValidExpressions1("0", 0)); // 期望: 1
console.log('方法2 s="00" target=0:', countValidExpressions2("00", 0)); // 期望: 1 (仅 0+0；"00" 作为多位数非法)

export {};
