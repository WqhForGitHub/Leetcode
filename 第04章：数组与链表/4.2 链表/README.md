# 1. 链表常用操作
## 1.2 插入节点

在链表中插入节点非常容易。如图4-6所示，假设我们想在相邻的两个节点 `n0` 和 `n1` 之间插入一个新节点 `P`，**则只需要改变两个节点引用（指针）即可**，时间复杂度为 O(1)。

相比之下，在数组中插入元素的时间复杂度为 O(n)，在大数据量下的效率较低。

![链表插入节点示例](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E6%95%B0%E7%BB%84%E4%B8%8E%E9%93%BE%E8%A1%A8/%E9%93%BE%E8%A1%A8%E6%8F%92%E5%85%A5%E8%8A%82%E7%82%B9%E7%A4%BA%E4%BE%8B.png)
图 4-6   链表插入节点示例
```javascript
/* 在链表的节点 n0 之后插入节点 P */
function insert(n0, P) {
	const n1 = n0.next;
	P.next = n1;
	n0.next = P;
}
```
## 1.3 删除节点

如图 4-7 所示，在链表中删除节点也非常方便，**只需改变一个节点的引用（指针）即可**。

请注意，尽管在删除操作完成后节点 `P` 仍然指向 `n1`，但实际上遍历此链表已经无法访问到 `P`，这意味着 `P` 已经不再属于该链表了。
![链表删除节点](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E6%95%B0%E7%BB%84%E4%B8%8E%E9%93%BE%E8%A1%A8/%E9%93%BE%E8%A1%A8%E5%88%A0%E9%99%A4%E8%8A%82%E7%82%B9.png)
图 4-7   链表删除节点
```javascript
/* 删除链表的节点 n0 之后的首个节点 */
function remove(n0) {
	if (!n0.next) return;
	// n0 -> P -> n1
	const P = n0.next;
	const n1 = P.next;
	n0.next = n1;
}
```
## 1.4 访问节点

**在链表中访问节点的效率较低**。如上一节所述，我们可以在 O(1) 时间下访问数组中的任意元素。链表则不然，程序需要从头节点出发，逐个向后遍历，直至找到目标节点。也就是说，访问链表的第 i 个节点需要循环 i - 1 轮，时间复杂度为 O(n)。
```javascript
/* 访问链表中索引为 index 的节点 */
function access(head, index) {
	for (let i = 0; i < index; i++) {
		if (!head) {
			return null;
		}
		head = head.next;
	}
	
	return head;
}
```
## 1.5 查找节点

遍历链表，查找其中值为 `target` 的节点，输出该节点在链表中的索引。此过程也属于线性查找。代码如下所示：
```javascript
/* 在链表中查找值为 target 的首个节点 */
function find(head, target) {
	let index = 0;
	while (head != null) {
		if (head.val === target) {
			return index;
		}
		head = head.next;
		index += 1;
	}
	return -1;
}
```
# 2. 数组 vs 链表

表 4-1 总结了数组和链表的各项特点并对比了操作效率。由于它们采用两种相反的存储策略，因此各种性质和操作效率也呈现对立的特点。

表 4-1   数组与链表的效率对比

|      | 数组              | 链表      |
| ---- | --------------- | ------- |
| 存储方式 | 连续内存空间          | 分散内存空间  |
| 容量扩展 | 长度不可变           | 可灵活扩展   |
| 内存效率 | 元素占用内存少、但可能浪费空间 | 元素占用内存多 |
| 访问元素 | O(1)            | O(n)    |
| 添加元素 | O(n)            | O(1)    |
| 删除元素 | O(n)            | O(1)    |







