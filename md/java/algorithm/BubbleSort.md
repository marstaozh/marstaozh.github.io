## 冒泡排序

> 基本思想：从最后连个元素开始进行比较，将较小的元素交换到前面去，依次进行比较交换。较小的元素冒泡似的到水面上。
>
> 具体做法：首先将第一个记录的关键字和第二个记录的关子健进行比较，若为逆序，则交换这两个记录的值，然后比较第二个记录和第三个记录的关键字，以此类推，知道第n-1个记录和第n个记录的关键字比较过为止。上述过程称为第一趟冒泡排序，其结果是关键字最大的记录被交换到第n个记录的位置上，然后进行第二趟冒泡排序，对前n-1个记录惊醒同样的操作，其结果是关键字次大的记录被交换到第n-1个记录的位置上。最多进行n-1趟，所有记录即为有序排列。若在某趟冒泡排序过程中没有进行相邻位置的元素交换，则可结束排序过程。
>
> 时间复杂度：O(N^2)
>
> 空间复杂度：O(1)
>
> 稳定性：稳定

* 代码实现

```java
/**
 * 冒泡排序算法
 * @author Mars
 */
public class BubbleSort extends BaseAlgorithm {

    public static void main(String[] args) {
        int[] waitToSort = randomIntArr();

        System.out.println("Before Sort: " + Arrays.toString(waitToSort));
        int tempKey;
        int roundIndex = 0;
        for (int i = waitToSort.length - 1; i > 0; i--) {
            boolean continueExchange = false;
            for (int j = 0; j < i; j++) {
                if (waitToSort[j] > waitToSort[j+1]) {
                    continueExchange = true;
                    tempKey = waitToSort[j];
                    waitToSort[j] = waitToSort[j+1];
                    waitToSort[j+1] = tempKey;
                }
            }
            System.out.printf("After No.%s round: %s", roundIndex++, Arrays.toString(waitToSort));
            System.out.println();

            if (!continueExchange) {
                break;
            }
        }
        System.out.println("After sort: " + Arrays.toString(waitToSort));
    }
}
```

