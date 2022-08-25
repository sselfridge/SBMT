namespace TodoApi.Models.db
{
  public class Student
  {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }

    public int? Grade { get; set; }
  }
}
