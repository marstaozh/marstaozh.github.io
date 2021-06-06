## 快速排序

> 基本思想：通过一趟排序将待排的记录划分为独立的两个部分，其中一部分记录的关键字均不大于另一个部分记录的关键字，然后再分别对着两部分记录继续进行快速排序，以达到整个序列有序。
>
> 实现方法：用一维数组存储记录，设两个指针i和j，它们的初始值分别指向第一个记录和最后一个记录。设枢纽记录（通常是第一个记录）的关键字为pivotKey，则首先从j所指的位置向前搜索，找到第一个关键字小于pivotKey的记录，并与枢纽记录互相交换，然后从i所指位置向后搜索，找到第一个关键字大雨pivotKey的记录，并与枢纽记录互相交换，重复这两步直到i=j时为止。
>
> 时间复杂度：O(N*log2N)
>
> 空间复杂度：O(N*log2N)
>
> 稳定性：不稳定

* 代码实现

```java
/**
 * @author Mars
 */
public class QuickSort extends BaseAlgorithm {

    public static void main(String[] args) {
        int[] waitToSort = randomIntArr();
        System.out.println("Before Sort: " + Arrays.toString(waitToSort));
        quick_sort(waitToSort, 0, waitToSort.length - 1);
        System.out.println("After sort: " + Arrays.toString(waitToSort));
    }

    /**
     * 返回调整后基准数的位置
     */
    static int adjustArray(int[] waitToSort, int left, int right) {

        int i = left, j = right;
        //waitToSort[left]即waitToSort[i]就是第一个坑
        int pivotKey = waitToSort[left];
        while (i < j) {
            // 从右向左找小于pivotKey的数来填s[i]
            while (i < j && waitToSort[j] >= pivotKey) {
                j--;
            }
            if (i < j) {
                //将waitToSort[j]填到waitToSort[i]中，waitToSort[j]就形成了一个新的坑
                waitToSort[i] = waitToSort[j];
                i++;
            }

            // 从左向右找大于或等于pivotKey的数来填waitToSort[j]
            while (i < j && waitToSort[i] < pivotKey) {
                i++;
            }
            if (i < j) {
                //将waitToSort[i]填到waitToSort[j]中，waitToSort[i]就形成了一个新的坑
                waitToSort[j] = waitToSort[i];
                j--;
            }
        }
        //退出时，i等于j。将pivotKey填到这个坑中。
        waitToSort[i] = pivotKey;

        return i;
    }

    static void quick_sort(int[] waitToSort, int left, int right) {
        if (left < right) {
            //先成挖坑填数法调整waitToSort[]
            int i = adjustArray(waitToSort, left, right);
            System.out.printf("The pivotKey [%s]: %s", waitToSort[i], Arrays.toString(waitToSort));
            System.out.println();
            // 递归调用
            quick_sort(waitToSort, left, i - 1);
            quick_sort(waitToSort, i + 1, right);
        }
    }
}
```

