using System.Text.Json;
using System.Text.Json.Serialization;

public class JsonDateTimeConverter : JsonConverter<DateTime>
{
  public override DateTime Read(
    ref Utf8JsonReader reader,
    Type typeToConvert,
    JsonSerializerOptions options
  )
  {
    // Parse the string value from JSON into a DateTime object
    if (reader.TokenType == JsonTokenType.String)
    {
      if (DateTime.TryParse(reader.GetString(), out DateTime dateTime))
      {
        return dateTime.ToUniversalTime();
      }
      else
      {
        throw new JsonException("Invalid date format");
      }
    }

    throw new JsonException("Unexpected token type");
  }

  public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
  {
    // Write the DateTime value to JSON as a string
    writer.WriteStringValue(value.ToString("yyyy-MM-ddTHH:mm:ssZ"));
  }
}
