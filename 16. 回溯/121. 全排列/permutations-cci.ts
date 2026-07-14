// ============================================================
// 121. 全排列
// ============================================================
// 面试金典 08.07 / LeetCode 46. Permutations
// 给定不含重复数字的数组，返回其所有全排列。

// 时间复杂度：O(n * n!)
// 空间复杂度：O(n) 递归栈

// 方法1：回溯 + used 标记
// 用 used 数组标记已使用元素，逐位填入排列。
// 时间复杂度 O(n * n!), 空间复杂度 O(n)
function permute(nums: number[]): number[][] {
  const n: number = nums.length;
  const result: number[][] = [];
  const path: number[] = [];
  const used: boolean[] = new Array(n).fill(false);

  function backtrack(): void {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i: number = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// 方法2：交换法
// 原地交换，固定前缀位置，递归处理剩余部分。
// 时间复杂度 O(n * n!), 空间复杂度 O(n) 递归栈
function permute2(nums: number[]): number[][] {
  const result: number[][] = [];
  const arr: number[] = [...nums];
  const n: number = arr.length;

  function swap(i: number, j: number): void {
    const tmp: number = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  function backtrack(index: number): void {
    if (index === n) {
      result.push([...arr]);
      return;
    }
    for (let i: number = index; i < n; i++) {
      swap(index, i);
      backtrack(index + 1);
      swap(index, i); // 恢复
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 121. 全排列 =====");
console.log(permute([1, 2, 3]));
// 期望: 6 个全排列
console.log(permute2([1, 2, 3]));
console.log(permute([0, 1]));

export {};
