## 算法的基础知识

### 0. 算法的特性

```
1. 有穷性：一个算法必须总是（任何合法的输入值）在执行了有穷步之后结束，且每一步都可在有穷时间内执行完。
2. 确定性：算法中的每一条指令有确切的含义，理解时不会产生歧义。
			在任何条件下，算法只有唯一的执行路径，即对于相同的输入只能得到相同的输出。
3. 可行性：一个算法是可行的，即算法中描述的操作都可以通过已经实现的基本运算执行有限次来实现。
4. 输入：一个算法有零个或多个输入，这些输入取自于某些特定的对象的集合。
5. 输出：一个算法有一个或多个输出，这些输出是同输入有着某些特定关系的量。
```



### 1. 时间复杂度

> 指程序从开始运行到结束运行所需要的时间。
>
> 常见的对算法执行所需时间的度量：
>
> O(1) < O(log2 n) < O(n) < O(nlog2 n) < O(n^2) < O(n^3) < O(2^n)

### 2. 空间复杂度

> 指一个算法在运行过程中临时占用存储空间大小的度量。
>
> 一个算法的空间复杂度只考虑运行过程中为局部变量分配的存储空间的大小。

### 3. 稳定性

> 若序列中，两个相邻的值相等，且在排序算法中，这两个值的先后顺序or位置不会发生改变，则为稳定，否则为不稳定。



## 快速插入排序

> 基本操作是将一个待插入的值，插入到已排序的序列中，从而得到一个新的、记录数增加1的序列
>
> 时间复杂度：O(n)
>
> 空间复杂度：O(1)
>
> 稳定性：稳定

* 代码实现

```java
public class StraightInsertionSort {

    public static void main(String[] args) {
        Random random = new Random();
        int[] waitToSort = new int[10];
        for (int i=0; i < 10; i++) {
            waitToSort[i] = random.nextInt(100);
        }

        straightInsertSort_1(waitToSort);
    }

    public static void straightInsertSort_1(int[] waitToSort) {
        System.out.println("Before sort: " + Arrays.toString(waitToSort));
        int tempKey;
        for (int i=1; i<waitToSort.length; i++) {
            // 临时存放当前比较的值。
            tempKey = waitToSort[i];
            int j = i-1;
            for (; j >= 0 && waitToSort[j] > tempKey; j--) {
                waitToSort[j+1] = waitToSort[j];
            }

            waitToSort[j+1] = tempKey;
        }
        System.out.println("After sort: " + Arrays.toString(waitToSort));
    }
}
```

