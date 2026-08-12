二分查找（binary search）是一种基于分治策略的高效搜索算法。它利用数据的有序性，每轮缩小一半搜索范围，直到找到目标元素或搜索区间为止。
>Questions
>给定一个长度为 n 的数组 `nums`，元素按从小到大的顺序排列且不重复。请查找并返回元素 `target` 在该数组中的索引。若数组不包含该元素，则返回 -1。示例如图10-1所示。

![二分查找示例数据](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Hello%20%E7%AE%97%E6%B3%95/%E7%AC%AC10%E7%AB%A0%EF%BC%9A%E6%90%9C%E7%B4%A2/%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE%E7%A4%BA%E4%BE%8B%E6%95%B0%E6%8D%AE.png)
图 10-1 二分查找示例数据

如图10-2 所示，我们先初始化指针 i = 0 和 j = n-1，分别指向数组首元素和尾元素，代表搜索区间 [0, n-1]。请注意，中括号表示闭区间，其包含边界值本身。
接下来，循环执行以下两步。
1. 计算中点索引 m = Math.floor((i + j) / 2)、
2. 判断 `nums[m]` 和 `target` 的大小关系，分为以下三种情况。
	a. 当 `nums[m] < target` 时，说明 `target` 在区间 [m+1, j] 中，因此执行 i = m + 1。
	b. 当 `nums[m]` > target 时，说明 `target` 在区间 [i, m-1] 中，因此执行 j = m - 1。
	c. 当 `nums[m] = target` 时，说明找到 `target`，因此返回索引 m。

若数组不包含目标元素，搜素区间最终会缩小为空。此时返回 -1。

值得注意的是，由于 i 和 j 都是 `int` 类型，**因此 i + j 可能会超出 `int` 类型的取值范围**。为了避免大数越界，我们通常采用公式 m =[i + (j - i) / 2] 来计算中点。
代码如下所示：
```typescript
/* 二分查找（双闭区间） */
function binarySearch(nums: number[], target: number): number {
    // 初始化双闭区间 [0, n-1] ，即 i, j 分别指向数组首元素、尾元素
    let i = 0,
        j = nums.length - 1;
    // 循环，当搜索区间为空时跳出（当 i > j 时为空）
    while (i <= j) {
        // 计算中点索引 m
        const m = Math.floor(i + (j - i) / 2);
        if (nums[m] < target) {
            // 此情况说明 target 在区间 [m+1, j] 中
            i = m + 1;
        } else if (nums[m] > target) {
            // 此情况说明 target 在区间 [i, m-1] 中
            j = m - 1;
        } else {
            // 找到目标元素，返回其索引
            return m;
        }
    }
    return -1; // 未找到目标元素，返回 -1
}
```
**时间复杂度为** O(logn)：在二分循环中，区间每轮缩小一半，因此循环次数为 log2​n。

**空间复杂度为** O(1)：指针  和  使用常数大小空间。