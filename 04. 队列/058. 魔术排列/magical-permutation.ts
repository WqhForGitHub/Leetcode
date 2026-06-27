// ============================================================
// 058. 魔术排列
// ============================================================
// LeetCode 周赛题. 魔术排列
// 给定一组数字 nums，求一个排列使得相邻元素的异或值都在 nums 中出现。

// ------------------------------------------------------------
// 方法1：DFS + 回溯
// ------------------------------------------------------------
// 构建异或图，用 DFS 遍历所有可能的排列。
// 时间 O(n!)，空间 O(n)。
function magicalPermutation1(nums: number[]): number[] {
  const n = nums.length;
  const xorSet: Set<number> = new Set(nums);
  const used: boolean[] = new Array(n).fill(false);
  let result: number[] | null = null;

  const dfs = (perm: number[], lastXor: number): void => {
    if (result) return;
    if (perm.length === n) {
      result = [...perm];
      return;
    }
    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        const xor = perm.length === 0 ? 0 : perm[perm.length - 1] ^ nums[i];
        if (perm.length === 0 || xorSet.has(xor)) {
          used[i] = true;
          perm.push(nums[i]);
          dfs(perm, xor);
          perm.pop();
          used[i] = false;
        }
      }
    }
  };

  dfs([], 0);
  return result || [];
}

// ------------------------------------------------------------
// 方法2：BFS + 队列
// ------------------------------------------------------------
// 用 BFS 队列搜索排列，从空排列开始逐步扩展。
// 时间 O(n!)，空间 O(n!)。
function magicalPermutation2(nums: number[]): number[] {
  const n = nums.length;
  const xorSet: Set<number> = new Set(nums);
  const queue: { perm: number[]; used: boolean[] }[] = [
    { perm: [], used: new Array(n).fill(false) },
  ];

  while (queue.length > 0) {
    const { perm, used } = queue.shift()!;
    if (perm.length === n) return perm;
    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        const xor = perm.length === 0 ? 0 : perm[perm.length - 1] ^ nums[i];
        if (perm.length === 0 || xorSet.has(xor)) {
          const newUsed = [...used];
          newUsed[i] = true;
          queue.push({ perm: [...perm, nums[i]], used: newUsed });
        }
      }
    }
  }
  return [];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    JSON.stringify(magicalPermutation1([0, 1, 2, 3])),
    "期望: 合法排列",
  );
  console.log(
    "测试2:",
    JSON.stringify(magicalPermutation1([1, 2, 3])),
    "期望: 合法排列或空",
  );
  console.log(
    "测试3:",
    JSON.stringify(magicalPermutation2([0, 1, 2, 3])),
    "期望: 合法排列",
  );
}

test();

export {};
