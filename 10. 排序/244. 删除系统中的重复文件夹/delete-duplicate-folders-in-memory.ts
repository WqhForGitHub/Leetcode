// ============================================================
// 244. 删除系统中的重复文件夹
// ============================================================
// LeetCode 1948. Delete Duplicate Folders in Memory
// 给定文件夹路径数组 paths，如果两个文件夹具有相同的子树结构（名称和结构都相同），
// 则视为重复，需要删除所有重复文件夹（保留一个）。返回剩余文件夹路径。

// 方法1：Trie 序列化 + 哈希分组标记删除（O(N * L)）
function deleteDuplicateFolder(paths: string[][]): string[][] {
  // Trie 节点
  interface TrieNode {
    name: string;
    children: Map<string, TrieNode>;
    serial: string; // 子树序列化
    deleted: boolean;
  }
  const newNode = (name: string): TrieNode => ({
    name,
    children: new Map(),
    serial: "",
    deleted: false,
  });
  const root = newNode("/");

  // 构建 Trie
  for (const path of paths) {
    let node = root;
    for (const name of path) {
      if (!node.children.has(name)) {
        node.children.set(name, newNode(name));
      }
      node = node.children.get(name)!;
    }
  }

  // 序列化每棵子树，统计序列化字符串出现次数
  const freq = new Map<string, number>();

  const serialize = (node: TrieNode): string => {
    if (node.children.size === 0) {
      node.serial = "";
      return "";
    }
    const parts: string[] = [];
    // 按名称排序保证唯一序列化
    const keys = [...node.children.keys()].sort();
    for (const key of keys) {
      const child = node.children.get(key)!;
      const childSerial = serialize(child);
      parts.push(key + "(" + childSerial + ")");
    }
    node.serial = parts.join("");
    freq.set(node.serial, (freq.get(node.serial) ?? 0) + 1);
    return node.serial;
  };

  serialize(root);

  // 标记重复子树为删除
  const markDeleted = (node: TrieNode): void => {
    for (const child of node.children.values()) {
      if (child.serial !== "" && (freq.get(child.serial) ?? 0) > 1) {
        child.deleted = true;
      }
      markDeleted(child);
    }
  };

  markDeleted(root);

  // 收集未被删除的路径
  const result: string[][] = [];
  const collect = (node: TrieNode, path: string[]): void => {
    for (const child of node.children.values()) {
      if (child.deleted) continue;
      const newPath = [...path, child.name];
      result.push(newPath);
      collect(child, newPath);
    }
  };

  collect(root, []);
  return result;
}

// 方法2：树序列化 + 哈希映射去重（O(N * L log L)）
function deleteDuplicateFolder2(paths: string[][]): string[][] {
  interface TreeNode {
    name: string;
    children: Map<string, TreeNode>;
    key: string;
    dup: boolean;
  }
  const create = (name: string): TreeNode => ({
    name,
    children: new Map(),
    key: "",
    dup: false,
  });
  const root = create("/");

  for (const path of paths) {
    let node = root;
    for (const name of path) {
      if (!node.children.has(name)) {
        node.children.set(name, create(name));
      }
      node = node.children.get(name)!;
    }
  }

  const count = new Map<string, number>();

  const buildKey = (node: TreeNode): string => {
    if (node.children.size === 0) {
      node.key = node.name;
      return node.key;
    }
    const parts: string[] = [];
    const keys = [...node.children.keys()].sort();
    for (const key of keys) {
      const child = node.children.get(key)!;
      parts.push(buildKey(child));
    }
    node.key = "(" + parts.join(",") + ")";
    count.set(node.key, (count.get(node.key) ?? 0) + 1);
    return node.key;
  };

  for (const child of root.children.values()) {
    buildKey(child);
  }

  const result: string[][] = [];
  const dfs = (node: TreeNode, path: string[]): void => {
    for (const child of node.children.values()) {
      if (child.children.size > 0 && (count.get(child.key) ?? 0) > 1) continue;
      const newPath = [...path, child.name];
      result.push(newPath);
      dfs(child, newPath);
    }
  };

  dfs(root, []);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 244. 删除系统中的重复文件夹 =====");
console.log(
  "方法1:",
  JSON.stringify(deleteDuplicateFolder([["a"], ["c"], ["d"], ["a", "b"], ["c", "b"], ["d", "a"]])),
);
// [["d"],["d","a"]]  (a-b 和 c-b 子树相同，删除)
console.log(
  "方法2:",
  JSON.stringify(deleteDuplicateFolder2([["a"], ["c"], ["d"], ["a", "b"], ["c", "b"], ["d", "a"]])),
);
console.log(
  "方法1:",
  JSON.stringify(
    deleteDuplicateFolder([["a"], ["c"], ["a", "b"], ["c", "b"], ["a", "b", "x"], ["c", "b", "x"]]),
  ),
);
console.log(
  "方法2:",
  JSON.stringify(
    deleteDuplicateFolder2([
      ["a"],
      ["c"],
      ["a", "b"],
      ["c", "b"],
      ["a", "b", "x"],
      ["c", "b", "x"],
    ]),
  ),
);

export {};
