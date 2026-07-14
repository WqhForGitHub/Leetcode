// ============================================================
// 054. 最大子数组异或值
// ============================================================
// LeetCode 周赛题. 最大子数组异或值
// 找到数组中连续子数组的最大异或值。

// ------------------------------------------------------------
// 方法1：前缀异或 + Trie 树
// ------------------------------------------------------------
// 用前缀异或和 prefixXor，对每个 prefixXor[i] 在 Trie 中找异或最大值。
// 时间 O(n)，空间 O(n)。
class XorTrieNode {
  children: (XorTrieNode | null)[] = [null, null];
}

function maximumSubarrayXor1(nums: number[]): number {
  const root = new XorTrieNode();
  let prefixXor = 0;
  let result = 0;

  const insert = (val: number): void => {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (val >> i) & 1;
      if (!node.children[bit]) {
        node.children[bit] = new XorTrieNode();
      }
      node = node.children[bit]!;
    }
  };

  const query = (val: number): number => {
    let node = root;
    let ans = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (val >> i) & 1;
      const toggle = 1 - bit;
      if (node.children[toggle]) {
        ans |= 1 << i;
        node = node.children[toggle]!;
      } else if (node.children[bit]) {
        node = node.children[bit]!;
      } else {
        break;
      }
    }
    return ans;
  };

  insert(0);
  for (const num of nums) {
    prefixXor ^= num;
    result = Math.max(result, query(prefixXor));
    insert(prefixXor);
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：暴力枚举
// ------------------------------------------------------------
// 直接枚举所有子数组计算异或值。
// 时间 O(n^2)，空间 O(1)。
function maximumSubarrayXor2(nums: number[]): number {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    let xor = 0;
    for (let j = i; j < nums.length; j++) {
      xor ^= nums[j];
      result = Math.max(result, xor);
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maximumSubarrayXor1([1, 2, 3, 4]), "期望: 7");
  console.log("测试2:", maximumSubarrayXor1([8, 1, 2, 12]), "期望: 15");
  console.log("测试3:", maximumSubarrayXor2([1, 2, 3, 4]), "期望: 7");
  console.log("测试4:", maximumSubarrayXor2([8, 1, 2, 12]), "期望: 15");
}

test();

export {};
