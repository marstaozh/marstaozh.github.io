#  过滤器模式 - Filter、Criteria Pattern

* 设计模式思想

```
过滤器模式允许开发人员使用不同的标准来过滤一组对象，通过逻辑运算以解耦的方式把它们连接起来。
这种类型的设计模式属于结构型模式，它结合多个标准来获得单一标准。
```



* 代码实现

```java
public class Person {
   private String name;
   private String gender;
   private String maritalStatus;
 
   public Person(String name,String gender,String maritalStatus){
      this.name = name;
      this.gender = gender;
      this.maritalStatus = maritalStatus;    
   }
   public String getName() {
      return name;
   }
   public String getGender() {
      return gender;
   }
   public String getMaritalStatus() {
      return maritalStatus;
   }  
}

/**
* 过滤器接口
*/
public interface Criteria {
   public List<Person> meetCriteria(List<Person> persons);
}

/**
* 过滤器接口的实现类，过滤出男性集合
*/
public class CriteriaMale implements Criteria {
   @Override
   public List<Person> meetCriteria(List<Person> persons) {
      List<Person> malePersons = new ArrayList<Person>(); 
      for (Person person : persons) {
         if(person.getGender().equalsIgnoreCase("MALE")){
            malePersons.add(person);
         }
      }
      return malePersons;
   }
}

/**
* 过滤器接口的实现类，过滤出女性集合
*/
public class CriteriaFemale implements Criteria {
   @Override
   public List<Person> meetCriteria(List<Person> persons) {
      List<Person> femalePersons = new ArrayList<Person>(); 
      for (Person person : persons) {
         if(person.getGender().equalsIgnoreCase("FEMALE")){
            femalePersons.add(person);
         }
      }
      return femalePersons;
   }
}

/**
* 过滤器接口的实现类，过滤出单身集合
*/
public class CriteriaSingle implements Criteria {
   @Override
   public List<Person> meetCriteria(List<Person> persons) {
      List<Person> singlePersons = new ArrayList<Person>(); 
      for (Person person : persons) {
         if(person.getMaritalStatus().equalsIgnoreCase("SINGLE")){
            singlePersons.add(person);
         }
      }
      return singlePersons;
   }
}

/**
* 过滤器接口的实现类，过滤规则为“and”
* 提取两个过滤器中共同的属性
*/
public class AndCriteria implements Criteria {
   private Criteria criteria;
   private Criteria otherCriteria;
    
   public AndCriteria(Criteria criteria, Criteria otherCriteria) {
      this.criteria = criteria;
      this.otherCriteria = otherCriteria; 
   }
    
   @Override
   public List<Person> meetCriteria(List<Person> persons) {
      List<Person> firstCriteriaPersons = criteria.meetCriteria(persons);     
      return otherCriteria.meetCriteria(firstCriteriaPersons);
   }
}

/**
* 过滤器接口的实现类，过滤规则为“or”
* 提取两个过滤器中非重复的集合
*/
public class OrCriteria implements Criteria {
 
   private Criteria criteria;
   private Criteria otherCriteria;
 
   public OrCriteria(Criteria criteria, Criteria otherCriteria) {
      this.criteria = criteria;
      this.otherCriteria = otherCriteria; 
   }
 
   @Override
   public List<Person> meetCriteria(List<Person> persons) {
      List<Person> firstCriteriaItems = criteria.meetCriteria(persons);
      List<Person> otherCriteriaItems = otherCriteria.meetCriteria(persons);
 
      for (Person person : otherCriteriaItems) {
         if(!firstCriteriaItems.contains(person)){
           firstCriteriaItems.add(person);
         }
      }  
      return firstCriteriaItems;
   }
}

public class CriteriaPatternDemo {
   public static void main(String[] args) {
      List<Person> persons = new ArrayList<Person>();
 
      persons.add(new Person("Robert","Male", "Single"));
      persons.add(new Person("John","Male", "Married"));
      persons.add(new Person("Laura","Female", "Married"));
      persons.add(new Person("Diana","Female", "Single"));
      persons.add(new Person("Mike","Male", "Single"));
      persons.add(new Person("Bobby","Male", "Single"));
 
      Criteria male = new CriteriaMale();
      Criteria female = new CriteriaFemale();
      Criteria single = new CriteriaSingle();
      Criteria singleMale = new AndCriteria(single, male);
      Criteria singleOrFemale = new OrCriteria(single, female);
 
      System.out.println("Males: ");
      printPersons(male.meetCriteria(persons));
 
      System.out.println("\nFemales: ");
      printPersons(female.meetCriteria(persons));
 
      System.out.println("\nSingle Males: ");
      printPersons(singleMale.meetCriteria(persons));
 
      System.out.println("\nSingle Or Females: ");
      printPersons(singleOrFemale.meetCriteria(persons));
   }
 
   public static void printPersons(List<Person> persons){
      for (Person person : persons) {
         System.out.println("Person : [ Name : " + person.getName() 
            +", Gender : " + person.getGender() 
            +", Marital Status : " + person.getMaritalStatus()
            +" ]");
      }
   }      
}
```



* UML图

![过滤器模式的 UML 图](../filter-pattern.svg)
