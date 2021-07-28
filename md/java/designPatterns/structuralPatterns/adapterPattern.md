# 适配器模式 - Adapter Pattern

* 设计模式思想

```
适配器模式（Adapter Pattern）是作为两个不兼容的接口之间的桥梁。
这种模式涉及到一个单一的类，该类负责加入独立的或不兼容的接口功能。
举个例子：读卡器是作为内存卡和笔记本之间的适配器。将内存卡插入读卡器，再将读卡器插入笔记本，这样就可以通过笔记本来读取内存卡。
```

* 代码实现

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



* UML图

![适配器模式的 UML 图](../adapter-pattern.png)

