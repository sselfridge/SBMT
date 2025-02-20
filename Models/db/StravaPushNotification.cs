using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace TodoApi.Models.db
{
  public class StravaPushNotificationDTO
  {
    [JsonPropertyName("aspect_type")]
    public string? AspectType { get; set; }

    [JsonPropertyName("event_time")]
    public long EventTime { get; set; }

    [JsonPropertyName("object_id")]
    public long ObjectId { get; set; }

    [JsonPropertyName("object_type")]
    public string? ObjectType { get; set; }

    [JsonPropertyName("owner_id")]
    public int OwnerId { get; set; }

    [JsonPropertyName("subscription_id")]
    public long SubscriptionId { get; set; }

    [JsonPropertyName("updates")]
    public JsonObject? Updates { get; set; }
  }

  public class StravaPushNotification
  {
    public Guid Id { get; set; }
    public string? AspectType { get; set; }
    public long EventTime { get; set; }
    public long ObjectId { get; set; }
    public string? ObjectType { get; set; }
    public int OwnerId { get; set; }
    public long SubscriptionId { get; set; }
    public string? Updates { get; set; }

    public StravaPushNotification(
      string? aspectType,
      long eventTime,
      long objectId,
      string? objectType,
      int ownerId,
      long subscriptionId
    )
    {
      AspectType = aspectType;
      EventTime = eventTime;
      ObjectId = objectId;
      ObjectType = objectType;
      OwnerId = ownerId;
      SubscriptionId = subscriptionId;
      Updates = null;
    }

    public StravaPushNotification(StravaPushNotificationDTO dto)
    {
      AspectType = dto.AspectType;
      EventTime = dto.EventTime;
      ObjectId = dto.ObjectId;
      ObjectType = dto.ObjectType;
      OwnerId = dto.OwnerId;
      SubscriptionId = dto.SubscriptionId;
      Updates = dto.Updates?.ToString();
    }
  }
}


//{

//  [JsonPropertyName("aspect_type")]
//  public string AspectType { get; set; }
//  [JsonPropertyName("event_time")]
//  public int EventTime { get; set; }
//  [JsonPropertyName("object_id")]
//  public int ObjectId { get; set; }
//  [JsonPropertyName("object_type")]
//  public string ObjectType { get; set; }
//  [JsonPropertyName("owner_id")]
//  public int OwnerId { get; set; }
//  [JsonPropertyName("subscription_id")]
//  public int SubscriptionId { get; set; }

//  [JsonPropertyName("updates")]
//  public JsonObject Updates { get; set; }
//}
