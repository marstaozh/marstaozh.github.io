## 简单选择排序

> n个记录进行简单选择排序的基本方法，是通过n-i（1 <= i <= n)次在关键字之间的比较，
>
> 从n-i+1个记录中选出关键字最小的记录，并和第i个记录进行交换，当i等于n时所有记录有序排列。
>
> 本质就是每次选择出最小的元素进行交换，主要是选择过程，交换过程只有一次。
>
> 比较操作的时间复杂度为：O(n^2)
>
> 移动操作的时间复杂度为：O(n)
>
> 空间复杂度为：O(1)
>
> 稳定性：不稳定

* 代码实现

```java
public class SimpleSelectedSort {

    public static void main(String[] args) {
        Random random = new Random();
        int[] waitToSort = new int[10];
        for (int i=0; i < 10; i++) {
            waitToSort[i] = random.nextInt(100);
        }

        System.out.println("Before sort: " + Arrays.toString(waitToSort));
        int tempKey;
        int tempIndex;
        for (int i = 0; i < waitToSort.length; i++) {
            tempKey = waitToSort[i];
            tempIndex = i;
            for (int j = i+1; j < waitToSort.length; j++) {
                if (tempKey > waitToSort[j]) {
                    tempKey = waitToSort[j];
                    tempIndex = j;
                }
            }
            waitToSort[tempIndex] = waitToSort[i];
            waitToSort[i] = tempKey;
        }
        System.out.println("After sort: " + Arrays.toString(waitToSort));
    }
}
```

