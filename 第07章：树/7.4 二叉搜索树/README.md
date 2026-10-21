如图 7-16 所示，二叉搜索树（binary search tree）满足以下条件。
1. 对于根节点，左子树中所有节点的值 < 根节点的值 < 右子树中所有节点的值。
2. 任意节点的左、右子树也是二叉搜索树，即同样满足条件 `1.`。
![二叉搜索树](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC7%E7%AB%A0%EF%BC%9A%E6%A0%91/%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91.png)
图 7-16   二叉搜索树
# 1. 二叉搜索树的操作

我们将二叉搜索树封装为一个类 `BinarySearchTree`，并声明一个成员变量 `root`，指向树的根节点。
## 1.1 查找节点

给定目标节点值 `num`，可以根据二叉搜索树的性质来查找。如图 7-17 所示，我们声明一个节点 `cur`，从二叉树的根节点 `root` 触发，循环比较节点 `cur.val` 和 `num` 之间的大小关系。
- 若 `cur.val < num`，说明目标节点在 `cur` 的右子树中，因此执行 `cur = cur.right`。
- 若 `cur.val > num`，说明目标节点在 `cur` 的左子树中，因此执行 `cur = cur.left`。
- 若 `cur.val = num`，说明找到目标节点，跳出循环并返回该节点。

![二叉搜索树查找节点示例](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC7%E7%AB%A0%EF%BC%9A%E6%A0%91/%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E6%9F%A5%E6%89%BE%E8%8A%82%E7%82%B9%E7%A4%BA%E4%BE%8B.gif)
图 7-17   二叉搜索树查找节点示例

二叉搜索树的查找操作与二分查找算法的工作原理一致，都是每轮排除一半情况。循环次数最多为二叉树的高度，当二叉树平衡时，使用 O(logn) 时间。示例代码如下：
```javascript
/* 查找节点 */
search(num) {
	let cur = this.root;
	// 循环查找，越过叶节点后跳出
	while (cur !== null) {
		// 目标节点在 cur 的右子树中
		if (cur.val < num) cur = cur.right;
		// 目标节点在 cur 的左子树中
		else if (cur.val > num) cur = cur.left;
		// 找到目标节点，跳出循环
		else break;
	}
	// 返回目标节点
	return cur;
}
```



