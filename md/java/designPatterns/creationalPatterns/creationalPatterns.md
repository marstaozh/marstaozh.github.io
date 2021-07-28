# 创建型模式

> 提供一种在创建对象的同时隐藏创建逻辑的方式，而不是使用new运算符直接实例化对象。
>
> 这使得程序在判断针对某个给定实例需要创建哪些对象时更加灵活。



## 1. 工厂模式 - Factory Pattern

* **意图**

```
定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行
```

* **主要解决**

```
主要解决接口选择的问题
```

* **何时使用**

```
明确地计划不同条件下创建不同实例时
```

* **如何解决**

```
让其子类实现工厂接口，返回的也是一个抽象的产品
```

* **关键代码**

```
创建过程在其子类执行
```

* **优点**

```
1、一个调用者想创建一个对象，只要知道其名称就可以了
2、扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以
3、屏蔽产品的具体实现，调用者只关心产品的接口
```

* **缺点**

```
每次增加一个产品时，都需要增加一个具体类和对象实现工厂，使得系统中类的个数成倍增加，在一定程度上增加了系统的复杂度，同时也增加了系统具体类的依赖
```

* **代码实现**

```java
// Shape.java
public interface Shape {
   void draw();
}

// Rectangle.java
public class Rectangle implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Rectangle::draw() method.");
   }
}

// Square.java
public class Square implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Square::draw() method.");
   }
}

// Circle.java
public class Circle implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Circle::draw() method.");
   }
}

// 工厂类：ShapeFactory.java 
public class ShapeFactory {
   //使用 getShape 方法获取形状类型的对象
   public Shape getShape(String shapeType){
      if(shapeType == null){
         return null;
      }        
      if(shapeType.equalsIgnoreCase("CIRCLE")){
         return new Circle();
      } else if(shapeType.equalsIgnoreCase("RECTANGLE")){
         return new Rectangle();
      } else if(shapeType.equalsIgnoreCase("SQUARE")){
         return new Square();
      }
      return null;
   }
}

// FactoryPatternDemo.java
public class FactoryPatternDemo {
   public static void main(String[] args) {
      ShapeFactory shapeFactory = new ShapeFactory();
 
      //获取 Circle 的对象，并调用它的 draw 方法
      Shape shape1 = shapeFactory.getShape("CIRCLE");
      shape1.draw();
 
      //获取 Rectangle 的对象，并调用它的 draw 方法
      Shape shape2 = shapeFactory.getShape("RECTANGLE");
      shape2.draw();
 
      //获取 Square 的对象，并调用它的 draw 方法
      Shape shape3 = shapeFactory.getShape("SQUARE");
      shape3.draw();
   }
}
```



## 2. 抽象工厂模式 - Abstract Factory Pattern

* **意图**

```
提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类
```

* **主要解决**

```
主要解决接口选择的问题
```

* **何时使用**

```
系统的产品有多于一个的产品族，而系统只消费其中某一族的产品
```

* **如何解决**

```
在一个产品族里面，定义多个产品
```

* **关键代码**

```
在一个工厂里聚合多个同类产品
```

* **优点**

```
当一个产品族中的多个对象被设计成一起工作时，它能保证客户端始终只使用同一个产品族中的对象
```

* **缺点**

```
产品族扩展非常困难，要增加一个系列的某一产品，既要在抽象的 Creator 里加代码，又要在具体的里面加代码
```

* **代码实现**

```java
// Shape.java
public interface Shape {
   void draw();
}

// Rectangle.java
public class Rectangle implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Rectangle::draw() method.");
   }
}

// Square.java
public class Square implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Square::draw() method.");
   }
}

// Circle.java
public class Circle implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Circle::draw() method.");
   }
}

// Color.java
public interface Color {
   void fill();
}

// Red.java
public class Red implements Color {
   @Override
   public void fill() {
      System.out.println("Inside Red::fill() method.");
   }
}

// Green.java
public class Green implements Color {
   @Override
   public void fill() {
      System.out.println("Inside Green::fill() method.");
   }
}

// Blue.java
public class Blue implements Color {
   @Override
   public void fill() {
      System.out.println("Inside Blue::fill() method.");
   }
}

public abstract class AbstractFactory {
   public abstract Color getColor(String color);
   public abstract Shape getShape(String shape) ;
}

// 工厂类：ShapeFactory.java 
public class ShapeFactory extends AbstractFactory {
   //使用 getShape 方法获取形状类型的对象
   public Shape getShape(String shapeType){
      if(shapeType == null){
         return null;
      }        
      if(shapeType.equalsIgnoreCase("CIRCLE")){
         return new Circle();
      } else if(shapeType.equalsIgnoreCase("RECTANGLE")){
         return new Rectangle();
      } else if(shapeType.equalsIgnoreCase("SQUARE")){
         return new Square();
      }
      return null;
   }
   @Override
   public Color getColor(String color) {
      return null;
   }
}

public class ColorFactory extends AbstractFactory {
   @Override
   public Shape getShape(String shapeType){
      return null;
   }
   @Override
   public Color getColor(String color) {
      if(color == null){
         return null;
      }        
      if(color.equalsIgnoreCase("RED")){
         return new Red();
      } else if(color.equalsIgnoreCase("GREEN")){
         return new Green();
      } else if(color.equalsIgnoreCase("BLUE")){
         return new Blue();
      }
      return null;
   }
}

public class FactoryProducer {
   public static AbstractFactory getFactory(String choice){
      if(choice.equalsIgnoreCase("SHAPE")){
         return new ShapeFactory();
      } else if(choice.equalsIgnoreCase("COLOR")){
         return new ColorFactory();
      }
      return null;
   }
}

public class AbstractFactoryPatternDemo {
   public static void main(String[] args) {
      //获取形状工厂
      AbstractFactory shapeFactory = FactoryProducer.getFactory("SHAPE");
      //获取形状为 Circle 的对象
      Shape shape1 = shapeFactory.getShape("CIRCLE");
      shape1.draw();
      //获取形状为 Rectangle 的对象
      Shape shape2 = shapeFactory.getShape("RECTANGLE");
      shape2.draw();
      //获取形状为 Square 的对象
      Shape shape3 = shapeFactory.getShape("SQUARE");
      shape3.draw();
       
      //获取颜色工厂
      AbstractFactory colorFactory = FactoryProducer.getFactory("COLOR");
      //获取颜色为 Red 的对象
      Color color1 = colorFactory.getColor("RED");
      color1.fill();
      //获取颜色为 Green 的对象
      Color color2 = colorFactory.getColor("Green");
      color2.fill();
      //获取颜色为 Blue 的对象
      Color color3 = colorFactory.getColor("BLUE");
      color3.fill();
   }
}
```



## 3. 单例模式 - Singleton Pattern

* **意图**

```
保证一个类仅有一个实例，并提供一个访问它的全局访问点
```

* **主要解决**

```
一个全局使用的类频繁地创建与销毁
```

* **何时使用**

```
当您想控制实例数目，节省系统资源的时候
```

* **如何解决**

```
判断系统是否已经有这个单例，如果有则返回，如果没有则创建
```

* **关键代码**

```
构造函数是私有的
```

* **优点**

```
1、在内存里只有一个实例，减少了内存的开销，尤其是频繁的创建和销毁实例（比如管理学院首页页面缓存）
2、避免对资源的多重占用（比如写文件操作）
```

* **缺点**

```
没有接口，不能继承，与单一职责原则冲突，一个类应该只关心内部逻辑，而不关心外面怎么样来实例化
```

* **代码实现**

```java
// 1. 饿汉式
public class Singleton {
   //创建 SingleObject 的一个对象
   private static SingleObject instance = new SingleObject();
   //让构造函数为 private，这样该类就不会被实例化
   private SingleObject(){}
   //获取唯一可用的对象
   public static SingleObject getInstance(){
      return instance;
   }
}

// 2. 懒汉式 - 线程不安全
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
  
    public static Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}

// 3. 懒汉式 - 线程安全
// 效率低
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
  
    public static synchronized Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}

// 4. 双检锁/双重校验锁（DCL，即 double-checked locking）
// 高性能
public class Singleton {  
    private volatile static Singleton singleton;  
    private Singleton (){}  
    public static Singleton getSingleton() {  
        if (singleton == null) {  
            synchronized (Singleton.class) {  
                if (singleton == null) {  
                    singleton = new Singleton();  
                }  
            }  
        }  
        return singleton;  
    }  
}

// 5. 登记式/静态内部类
public class Singleton {  
    private static class SingletonHolder {  
    	private static final Singleton INSTANCE = new Singleton();  
    }  
    private Singleton (){}  
    public static final Singleton getInstance() {  
    	return SingletonHolder.INSTANCE;  
    }  
}

// 6. 枚举
public enum Singleton {  
    INSTANCE;
    public void whateverMethod() {}  
}
```



## 4. 建造者模式 - Builder Pattern

* **意图**

```
将一个复杂的构建与其表示相分离，使得同样的构建过程可以创建不同的表示
```

* **主要解决**

```
主要解决在软件系统中，有时候面临着"一个复杂对象"的创建工作，其通常由各个部分的子对象用一定的算法构成；由于需求的变化，这个复杂对象的各个部分经常面临着剧烈的变化，但是将它们组合在一起的算法却相对稳定
```

* **何时使用**

```
一些基本部件不会变，而其组合经常变化的时候
```

* **如何解决**

```
将变与不变分离开
```

* **关键代码**

```
建造者：创建和提供实例，导演：管理建造出来的实例的依赖关系
```

* **优点**

```
1. 建造者独立，易扩展
2. 便于控制细节风险
```

* **缺点**

```
1. 产品必须有共同点，范围有限制
2. 如内部变化复杂，会有很多的建造类
```

* **代码实现**

```java
public interface Item {
   public String name();
   public Packing packing();
   public float price();    
}

public interface Packing {
   public String pack();
}

public class Wrapper implements Packing {
   @Override
   public String pack() {
      return "Wrapper";
   }
}

public class Bottle implements Packing {
   @Override
   public String pack() {
      return "Bottle";
   }
}

public abstract class Burger implements Item {
   @Override
   public Packing packing() {
      return new Wrapper();
   }
}

public abstract class ColdDrink implements Item {
    @Override
    public Packing packing() {
       return new Bottle();
    }
}

public class VegBurger extends Burger {
   @Override
   public float price() {
      return 25.0f;
   }
   @Override
   public String name() {
      return "Veg Burger";
   }
}

public class ChickenBurger extends Burger {
   @Override
   public float price() {
      return 50.5f;
   }
   @Override
   public String name() {
      return "Chicken Burger";
   }
}

public class Coke extends ColdDrink {
   @Override
   public float price() {
      return 30.0f;
   }
   @Override
   public String name() {
      return "Coke";
   }
}

public class Pepsi extends ColdDrink {
   @Override
   public float price() {
      return 35.0f;
   }
   @Override
   public String name() {
      return "Pepsi";
   }
}

public class Meal {
   private List<Item> items = new ArrayList<Item>();    
   public void addItem(Item item){
      items.add(item);
   }
   public float getCost(){
      float cost = 0.0f;
      for (Item item : items) {
         cost += item.price();
      }        
      return cost;
   }
   public void showItems(){
      for (Item item : items) {
         System.out.print("Item : "+item.name());
         System.out.print(", Packing : "+item.packing().pack());
         System.out.println(", Price : "+item.price());
      }        
   }    
}

public class MealBuilder {
   public Meal prepareVegMeal (){
      Meal meal = new Meal();
      meal.addItem(new VegBurger());
      meal.addItem(new Coke());
      return meal;
   }   
   public Meal prepareNonVegMeal (){
      Meal meal = new Meal();
      meal.addItem(new ChickenBurger());
      meal.addItem(new Pepsi());
      return meal;
   }
}
```



![建造者模式的 UML 图](builder-pattern.svg)



## 5. 原型模式 - Prototype Pattern

* **意图**

```

```

* **主要解决**

```

```

* **何时使用**

```

```

* **如何解决**

```

```

* **关键代码**

```

```

* **应用实例**

```

```

* **优点**

```

```

* **缺点**

```

```

* **代码实现**

```

```

