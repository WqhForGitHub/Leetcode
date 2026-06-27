// ============================================================
// 018. 戳印序列
// ============================================================
// LeetCode 936. Stamping The Sequence
// 用印章 stamp 盖在目标 target 上，每次覆盖连续 len(stamp) 个字符。
// 求一种盖章顺序使得最终得到 target，返回每次盖章的起始下标。

// ------------------------------------------------------------
// 方法1：逆向 BFS / 拓扑排序
// ------------------------------------------------------------
// 从 target 逆向思考：把 target 中被盖章的位置替换为通配符 '*'，
// 当某位置能被 stamp 完全匹配时，把它"取消盖章"变为全 '*'。
// 用队列模拟直到所有位置都变成 '*'。
// 时间 O(n*m*(n-m))，空间 O(n)。
function movesToStamp1(stamp: string, target: string): number[] {
  const m = stamp.length;
  const n = target.length;
  const targetArr = target.split("");
  const stamped: boolean[] = new Array(n).fill(false);
  const result: number[] = [];

  const canUnstamp = (start: number): boolean => {
    let matched = false;
    for (let i = 0; i < m; i++) {
      if (targetArr[start + i] !== "*" && targetArr[start + i] !== stamp[i]) {
        return false;
      }
      if (targetArr[start + i] !== "*") {
        matched = true;
      }
    }
    return matched;
  };

  const doUnstamp = (start: number): void => {
    for (let i = 0; i < m; i++) {
      targetArr[start + i] = "*";
    }
  };

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i <= n - m; i++) {
      if (!stamped[i] && canUnstamp(i)) {
        doUnstamp(i);
        stamped[i] = true;
        result.push(i);
        changed = true;
      }
    }
  }

  // 检查是否全部变为 '*'
  if (!targetArr.every((c) => c === "*")) return [];
  result.reverse();
  return result;
}

// ------------------------------------------------------------
// 方法2：拓扑排序（窗口依赖）
// ------------------------------------------------------------
// 将每个可能的盖章位置看作节点，用入度表示有多少字符尚未被通配，
// 当某窗口所有字符已通配或匹配时可以盖章。
// 时间 O(n*m)，空间 O(n)。
function movesToStamp2(stamp: string, target: string): number[] {
  const m = stamp.length;
  const n = target.length;
  const targetArr = target.split("");
  const result: number[] = [];
  const made: boolean[] = new Array(n).fill(false);
  const todo: number[] = [];

  // 每个窗口的不匹配字符集合
  const mismatched: Set<number>[] = [];
  // 字符到窗口的映射
  const charToWindows: Map<number, number[]> = new Map();

  for (let i = 0; i <= n - m; i++) {
    const s = new Set<number>();
    for (let j = 0; j < m; j++) {
      if (targetArr[i + j] !== stamp[j]) {
        s.add(i + j);
      }
    }
    mismatched[i] = s;
    if (s.size === 0) {
      todo.push(i);
    }
    for (let j = 0; j < m; j++) {
      const key = i + j;
      if (!charToWindows.has(key)) charToWindows.set(key, []);
      charToWindows.get(key)!.push(i);
    }
  }

  while (todo.length > 0) {
    const win = todo.pop()!;
    result.push(win);
    for (let j = 0; j < m; j++) {
      const idx = win + j;
      if (!made[idx]) {
        made[idx] = true;
        for (const w of charToWindows.get(idx) || []) {
          mismatched[w].delete(idx);
          if (mismatched[w].size === 0) {
            todo.push(w);
          }
        }
      }
    }
  }

  if (!made.every((v) => v)) return [];
  result.reverse();
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    JSON.stringify(movesToStamp1("abc", "ababc")),
    "期望: [0,2] 或类似",
  );
  console.log(
    "测试2:",
    JSON.stringify(movesToStamp1("abca", "aabcaca")),
    "期望: [3,0,1] 或类似",
  );
  console.log(
    "测试3:",
    JSON.stringify(movesToStamp2("abc", "ababc")),
    "期望: [0,2] 或类似",
  );
}

test();

export {};
