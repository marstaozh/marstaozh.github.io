# 单例模式 - Singleton Pattern

* 设计模式思想

```
保证一个类仅有一个实例，并提供一个访问它的全局访问点。

一般情况下选“饿汉式”
有懒加载要求的，首选“登记方式/静态内部类”
涉及到序列和反序列化创建对象的，首选“枚举方式”
其他特殊需求，可选“双检锁方式”
```



* 代码实现

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



* UML图

