## Java集合学习

```
1. 为什么要学习Java集合
Q: 我们得知道为什么要学习Java集合，学到Java集合的时候已经学过了数组了，为什么我不⽤数组反⽽⽤Java集合。数组和Java集合有什么区别？
A:Java是⼀⻔⾯向对象的语⾔，就免不了处理对象，为了⽅便操作多个对象，那么我们就得把这多个对象存储起来，想要存储多个对象(变量),很容易就能想到⼀个容器(集合)来装载

总的来说：就是Java给我们提供了⼯具⽅便我们去操作多个Java对象。

2. 如何入门学习Java集合
Q: 从上⾯我们已经知道了为什么要学Java集合，下⾯我们就该知道Java集合的基本⽤法，以及从它整体
的知识点去了解它是什么？
A： 我们学习Java集合实际上就是为了⽅便操作多个对象，⽽Java给我们提供⼀系列的API(⽅法)供我们
去操作。所以在初学Java集合的时候我们更多的是学习这些API(⽅法)分别是什么意思。

Q： 对Java集合的API使⽤有⼀定的了解之后，我们就应该从⾯向对象的⻆度去理解它。为什么会抽象
出多个接⼝，以及每个接⼝的有什么特性。
A: 我们可以总结出⼏个常⽤的实现类，如Collection、Map接口，这⼏个常⽤的实现类我们必须要知道它的数据结构是什么，什么时候使⽤这个类。

Java集合的常用接口，及其子类：
									 |-->Vector
									 |-->LinkedList
						   |-->List--|-->ArrayList
						   |		 |-->CopyOnWriteArrayList
		|-->Collection接口--|
		|				   |		|-->HashSet
Object--|			       |-->Set--|-->LinkedHashSet
		|							|-->TreeSet
		|
		|			|HashMap
		|-->Map接口--|LinkedHashMap
					|TreeMap
					|ConcurrentHashMap

Java集合相关的数据结构：

		  		|-->数组
DataStructure-->|-->链表
		  		|-->散列表
		  		|-->红黑树

简单了解各个实现类的数据结构以后，我们可能会简单记住下⾯的结论：
·如果是集合类型，有List和Set供我们选择。List的特点是插⼊有序的，元素是可重复的。Set的特点是插⼊⽆序的，元素不可重复的。⾄于选择哪个实现类来作为我们的存储容器，我们就得看具体的应⽤场景。是希望可重复的就得⽤List，选择List下常⻅的⼦类。是希望不可重复，选择Set下常⻅的⼦类。
·如果是 Key-Value 型，那我们会选择Map。如果要保持插⼊顺序的，我们可以选择LinkedHashMap，如果不需要则选择HashMap，如果要排序则选择TreeMap。
```

<img src="..\image\java\image1-JavaContainerSummary.jpg" alt="Java容器总结"  />







### 1. 集合(Collection)介绍

#### 1.1 为什么需要Collection

```
· Java是一门面向对象的语言，就免不了处理对象
· 为了方便操作多个对象，就需要把这么多个对象存储起来
· 想要存储多个对象or变量，就需要用到一个容器
· 常用的容器有:StringBuffered, 数组（虽然有对象数组，但数组的长度是不可变的！）
· 所以，Java就提供了集合(Collection)
```

#### 1.2 数组和集合的区别

```
· 长度的却别
	数组的长度固定
	集合的长度可变
· 元素的数据类型
	数组可以存储基本数据类型，也可以存储引用类型
	集合只能存储引用类型(你存储的事简单的int，会自动装箱成Integer)
```

#### 1.3 Collection的由来与功能

#### · Collection的由来：

```
· 集合可以存储多个元素，但我们对多个元素也有不同的需求
	· 多个元素，不能有相同的
	· 多个元素，能够按照某个规则排序
· 针对不同需求：Java提供了很多集合类，多个集合类的数据结构不同。但是，结构不重要，重要的事能够存储东西，能够判断，获取。
· 把集合共性的内容不断往上抽取，最终形成集合的继承体系->Collection
```

![Collection集合及其子类](..\image\java\image1-CollectionsClassUML.png)





#### · Collection的功能方法：

```
1. 添加功能
	· boolean add(Object obj): 添加一个元素
	· boolean addAll(Collection c): 添加一个集合的元素
2. 删除功能
	· void clear(): 移除所有的元素
	· boolean remove(Object obj): 移除一个元素
	· boolean removeAll(Collection c): 移除一个集合的元素，只要一个元素被移除了，就返回true
3. 判断功能
	· boolean contains(Object obj): 判断集合中是否包含该元素 
	· boolean containsAll(Collection c): 判断集合中是否包含指定的集合元素，只有包含所有的元素，才叫包含，才返回true
	· boolean isEmpty(): 判断集合是否为空
4. 获取功能
	· Iterator<E> iterator(): 迭代器
5. 长度功能
	· int size(): 获取元素的个数
6. 交集功能
	· boolean retainAll(Collection c): 移除此集合中未包含在指定集合中的所有元素。
	集合A和集合B做交集，最终的结果保存在集合A，返回值表示的是A是否发生变化。
```

![Collection集合方法](..\image\java\image1-CollectionMethod.png)





### 2. 迭代器(Iterator)



