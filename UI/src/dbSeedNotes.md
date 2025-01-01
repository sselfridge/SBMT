json formatting:

- remove quote from bool, use lower case
- format date strings to: 2023-05-20T08:43:08Z (UTC time)
  I think things are stored as UTC timezone, but actually use PST...
- numbers NOT strings, OR
  var newUser = JsonSerializer.Deserialize<StravaUser>(jsonStr, new JsonSerializerOptions
  {
  NumberHandling = JsonNumberHandling.AllowReadingFromString
  });
