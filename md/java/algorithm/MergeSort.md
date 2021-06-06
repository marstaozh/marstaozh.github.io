## 归并排序

> 把一个有n个记录的无序文件看成是由n个长度为1的有序子文件组成的文件，然后进行两两归并，得到（n/2向上取整）个长度为2或1的有序文件，再两两归并；如此重复，知道最后形成包含n个记录的有序文件为止。这种反复将两个有序文件归并成一个有序文件的排序称为两路归并排序。
>
> 时间复杂度：O(N*log2N)
>
> 空间复杂度：O(N)
>
> 稳定性：不稳定

* 代码实现

```java
/**
 * @author Mars
 */
public class MergeSort extends BaseAlgorithm {

    public static void main(String[] args) {
        int[] waitToSort = randomIntArr();
        System.out.println("Before Sort: " + Arrays.toString(waitToSort));
        int[] sortedArr = mergeSort(waitToSort, 0, waitToSort.length - 1);
        System.out.println("After Sort: " + Arrays.toString(sortedArr));
    }

    public static int[] mergeSort(int[] waitToSort, int left, int right) {
        if (left == right) {
            return new int[] { waitToSort[left] };
        }

        int mid = left + (right - left) / 2;
        //左有序数组
        int[] leftArr = mergeSort(waitToSort, left, mid);
        System.out.println(String.format("From index [%s], to index [%s], get the leftArr: %s", left, mid, Arrays.toString(leftArr)));
        //右有序数组
        int[] rightArr = mergeSort(waitToSort, mid + 1, right);
        System.out.println(String.format("From index [%s], to index [%s], get the rightArr: %s", mid + 1, right, Arrays.toString(rightArr)));
        //新有序数组
        int[] newArr = new int[leftArr.length + rightArr.length];

        int m = 0, i = 0, j = 0;
        while (i < leftArr.length && j < rightArr.length) {
            newArr[m++] = leftArr[i] < rightArr[j] ? leftArr[i++] : rightArr[j++];
        }
        while (i < leftArr.length) {
            newArr[m++] = leftArr[i++];
        }
        while (j < rightArr.length) {
            newArr[m++] = rightArr[j++];
        }
        System.out.println(String.format("From index [%s], to index [%s], get the newArr: %s", left, right, Arrays.toString(newArr)));
        return newArr;
    }
}
```

