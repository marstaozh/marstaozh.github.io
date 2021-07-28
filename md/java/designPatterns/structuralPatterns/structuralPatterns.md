# 结构型模式

> 关注类和对象的组合。集成的概念被用来组合接口和定义组合对象获得新功能的方式。



## 1. 适配器模式 - Adapter Pattern

* **意图**

```
将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作
```

* **主要解决**

```
主要解决在软件系统中，常常要将一些"现存的对象"放到新的环境中，而新环境要求的接口是现对象不能满足的
```

* **何时使用**

```

```

* **如何解决**

```
继承或依赖（推荐）
```

* **关键代码**

```
适配器继承或依赖已有的对象，实现想要的目标接口
```

* **应用实例**

```

```

* **优点**

```
 1. 可以让任何两个没有关联的类一起运行
 2. 提高了类的复用
 3. 增加了类的透明度 
 4. 灵活性好
```

* **缺点**

```
1. 过多地使用适配器，会让系统非常零乱，不易整体进行把握
2. 由于 JAVA 至多继承一个类，所以至多只能适配一个适配者类，而且目标类必须是抽象类
```

* **代码实现**

```java
public interface MediaPlayer {
   public void play(String audioType, String fileName);
}

public interface AdvancedMediaPlayer { 
   public void playVlc(String fileName);
   public void playMp4(String fileName);
}

public class VlcPlayer implements AdvancedMediaPlayer{
   @Override
   public void playVlc(String fileName) {
      System.out.println("Playing vlc file. Name: "+ fileName);      
   }
   @Override
   public void playMp4(String fileName) {
      //什么也不做
   }
}

public class Mp4Player implements AdvancedMediaPlayer{
   @Override
   public void playVlc(String fileName) {
      //什么也不做
   }
   @Override
   public void playMp4(String fileName) {
      System.out.println("Playing mp4 file. Name: "+ fileName);      
   }
}

public class MediaAdapter implements MediaPlayer {
   AdvancedMediaPlayer advancedMusicPlayer;
   public MediaAdapter(String audioType){
      if(audioType.equalsIgnoreCase("vlc") ){
         advancedMusicPlayer = new VlcPlayer();       
      } else if (audioType.equalsIgnoreCase("mp4")){
         advancedMusicPlayer = new Mp4Player();
      }  
   }
   @Override
   public void play(String audioType, String fileName) {
      if(audioType.equalsIgnoreCase("vlc")){
         advancedMusicPlayer.playVlc(fileName);
      }else if(audioType.equalsIgnoreCase("mp4")){
         advancedMusicPlayer.playMp4(fileName);
      }
   }
}

public class AudioPlayer implements MediaPlayer {
   MediaAdapter mediaAdapter; 
   @Override
   public void play(String audioType, String fileName) {    
      //播放 mp3 音乐文件的内置支持
      if(audioType.equalsIgnoreCase("mp3")){
         System.out.println("Playing mp3 file. Name: "+ fileName);         
      } 
      //mediaAdapter 提供了播放其他文件格式的支持
      else if(audioType.equalsIgnoreCase("vlc") 
         || audioType.equalsIgnoreCase("mp4")){
         mediaAdapter = new MediaAdapter(audioType);
         mediaAdapter.play(audioType, fileName);
      }
      else{
         System.out.println("Invalid media. "+
            audioType + " format not supported");
      }
   }   
}
```





## 2. 桥接模式 - Bridge Pattern

* **意图**

```
将抽象部分与实现部分分离，使它们都可以独立的变化
```

* **主要解决**

```
在有多种可能会变化的情况下，用继承会造成类爆炸问题，扩展起来不灵活
```

* **何时使用**

```
实现系统可能有多个角度分类，每一种角度都可能变化
```

* **如何解决**

```
把这种多角度分类分离出来，让它们独立变化，减少它们之间耦合
```

* **关键代码**

```
抽象类依赖实现类
```

* **优点**

```
1. 抽象和实现的分离
2. 优秀的扩展能力
3. 实现细节对客户透明
```

* **缺点**

```
桥接模式的引入会增加系统的理解与设计难度
由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计与编程
```

* **代码实现**

```java
public interface DrawAPI {
   public void drawCircle(int radius, int x, int y);
}

public class RedCircle implements DrawAPI {
   @Override
   public void drawCircle(int radius, int x, int y) {
      System.out.println("Drawing Circle[ color: red, radius: "
         + radius +", x: " +x+", "+ y +"]");
   }
}

public class GreenCircle implements DrawAPI {
   @Override
   public void drawCircle(int radius, int x, int y) {
      System.out.println("Drawing Circle[ color: green, radius: "
         + radius +", x: " +x+", "+ y +"]");
   }
}

public abstract class Shape {
   protected DrawAPI drawAPI;
   protected Shape(DrawAPI drawAPI){
      this.drawAPI = drawAPI;
   }
   public abstract void draw();  
}

public class Circle extends Shape {
   private int x, y, radius;
 
   public Circle(int x, int y, int radius, DrawAPI drawAPI) {
      super(drawAPI);
      this.x = x;  
      this.y = y;  
      this.radius = radius;
   }
 
   public void draw() {
      drawAPI.drawCircle(radius,x,y);
   }
}

public class BridgePatternDemo {
   public static void main(String[] args) {
      Shape redCircle = new Circle(100,100, 10, new RedCircle());
      Shape greenCircle = new Circle(100,100, 10, new GreenCircle());
 
      redCircle.draw();
      greenCircle.draw();
   }
}
```







## 3. 过滤器模式 - Filter、Criteria Pattern

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



## 4. 组合模式 - Composite Pattern

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



## 5. 装饰器模式 - Decorator Pattern

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



## 6. 外观模式 - Facade Pattern

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



## 7. 亨元模式 - Flyweight Pattern

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



## 8. 代理模式 - Proxy Pattern

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



