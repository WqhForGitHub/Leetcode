在链表表示下，二叉树的存储单元为节点 `TreeNode`，节点之间通过指针相连接。上一节介绍了链表表示下的二叉树的各项基本操作。

那么，我们能否用数组来表示二叉树呢？答案是肯定的。

# 1. 表示完美二叉树

先分析一个简对应唯一的数组索引。

根据层序遍历的特性，我们可以推导出父节点索引与子节点索引之间的“映射公式”：**若某节点的索引为 i，则该节点的左子节点索引为 2i + 1，右子节点索引为 2i + 2**。图 7-12 展示了各个节点索引之间的映射关系。
![完美二叉树的数组表示](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC7%E7%AB%A0%EF%BC%9A%E6%A0%91/%E5%AE%8C%E7%BE%8E%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%95%B0%E7%BB%84%E8%A1%A8%E7%A4%BA.png)
图 7-12   完美二叉树的数组表示
**映射公式的角色相当于链表中的节点引用（指针）。** 给定数组中的任意一个节点，我们都可以通过映射公式来访问它的左（右）子节点。
# 2. 表示任意二叉树

完美二叉树是一个特例，在二叉树的中间层通常存在许多 `None`。由于层序遍历序列并不包含这些 `None`，因此我们无法仅凭该序列来推测 `None` 的数量和分布位置。**这意味着存在多种二叉树结构都符合该层序遍历序列**。

如图 7-13 所示，给定一颗非完美二叉树，上述数组表示方法已经失效。
![层序遍历序列对应多种二叉树可能性](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC7%E7%AB%A0%EF%BC%9A%E6%A0%91/%E5%B1%82%E5%BA%8F%E9%81%8D%E5%8E%86%E5%BA%8F%E5%88%97%E5%AF%B9%E5%BA%94%E5%A4%9A%E7%A7%8D%E4%BA%8C%E5%8F%89%E6%A0%91%E5%8F%AF%E8%83%BD%E6%80%A7.png)
图 7-13   层序遍历序列对应多种二叉树可能性

为了解决此问题，**我们考虑在层序遍历序列中显式地写出所有 `None`**。如图 7-14 所示，这样处理后，层序遍历序列就可以唯一表示二叉树了。示例代码如下：
```javascript
/* 二叉树的数组表示 */
// 使用 null 来表示空位
let tree = [1 , 2, 3, 4, null, 6, 7, 8, 9, null, null, 12, null, null, 15];
```
![任意类型二叉树的数组表示](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC7%E7%AB%A0%EF%BC%9A%E6%A0%91/%E4%BB%BB%E6%84%8F%E7%B1%BB%E5%9E%8B%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%95%B0%E7%BB%84%E8%A1%A8%E7%A4%BA.png)
图 7-14   任意类型二叉树的数组表示

值得说明的是，**完全二叉树非常适合使用数组来表示**。回顾完全二叉树的定义，`None` 只出在最底层且靠右的位置，**因此所有 `None` 一定出现在层序遍历序列的末尾**。

这意味着使用数组表示完全二叉树时，可以省略存储所有 `None`，非常方便。图 7-15 给出了一个例子。
![完全二叉树的数组表示](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC7%E7%AB%A0%EF%BC%9A%E6%A0%91/%E5%AE%8C%E5%85%A8%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%95%B0%E7%BB%84%E8%A1%A8%E7%A4%BA.png)
图 7-15   完全二叉树的数组表示

以下代码实现了一颗基于数组表示的二叉树，包括以下几种操作。
- 给定某节点，获取它的值、左（右）子节点、父节点。
- 获取前序遍历、中序遍历、后序遍历、层序遍历序列。

```javascript
/* 数组表示下的二叉树类 */
class ArrayBinaryTree {
	#tree;
	
	/* 构造方法 */
	constructor(arr) {
		this.#tree = arr;
	}
	
	/* 列表容量 */
	size() {
		return this.#tree.length;
	}
	
	/* 获取索引为 i 节点的值 */
	val(i) {
		// 若索引越界，则返回 null，代表空位
		if (i < 0 || i >= this.size()) return null;
		return this.#tree[i];
	}
	
	/* 获取索引为 i 节点的左子节点的索引 */
	left(i) {
		return 2 * 1 + 1;
	}
	
	/* 获取索引为 i 节点的右子节点的索引 */
	right(i) {
		return 2 * i + 2;
	}
	
	/* 获取索引为 i 节点的父节点的索引 */
	parent(i) {
		return Math.floor((i - 1) / 2); // 向下整除
	}
	
	/* 层序遍历 */
	levelOrder() {
		let res = [];
		// 直接遍历数组
		for (let i = 0; i < this.size(); i++) {
			if (this.val(i) !== null) res.push(this.val(i));
		}
		return res;
	}
	
	/* 深度优先遍历 */
	#dfs(i, order, res) {
		// 若为空位，则返回
		if (this.val(i) === null) return;
		// 前序遍历
		if (order === 'pre') res.push(this.val(i));
		this.#dfs(this.left(i), order, res);
		// 中序遍历
		if (order === 'in') res.push(this.val(i));
		this.#dfs(this.right(i), order, res);
		// 后序遍历
		if (order === 'post') res.push(this.val(i));
	}
	
	/* 前序遍历 */
	preOrder() {
		const res = [];
		this.#dfs(0, 'pre', res);
		return res;
	}
	
	/* 中序遍历 */
	inOrder() {
		const res = [];
		this.#dfs(0, 'in', res);
		return res;
	}
	
	/* 后序遍历 */
	postOrder() {
		const res = [];
		this.#dfs(0, 'post', res);
		return res;
	}
}
```
# 3. 优点与局限性

二叉树的数组表示主要有以下优点。
- 数组存储的连续的内存空间中，对缓存友好，访问与遍历速度较快。
- 不需要存储指针，比较节省空间。
- 允许随机访问节点。
然而，数组表示也存在一些局限性。
- 数组存储需要连续内存空间，因此不适合存储数据量过大的树。
- 增删节点需要通过数组插入与删除操作实现，效率较低。
- 当二叉树中存在大量 `None` 时，数组中包含的节点数据比重较低，空间利用率较低。










