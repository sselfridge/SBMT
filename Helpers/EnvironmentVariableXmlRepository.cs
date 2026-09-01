namespace TodoApi.Helpers
{
  using System.Security.Cryptography;
  using System.Xml;
  using System.Xml.Linq;
  using Microsoft.AspNetCore.DataProtection.Repositories;

  /// <summary>
  /// Minimal IXmlRepository that derives keys from a base64-encoded master key string.
  /// Suitable for servers without persistent file storage.
  /// </summary>
  public class SimpleKeyRepository : IXmlRepository
  {
    private readonly string _masterKey;
    private readonly Guid _keyId;

    public SimpleKeyRepository(string masterKey)
    {
      _masterKey = masterKey;
      // Derive a consistent key ID from the master key using SHA256
      using (var sha = SHA256.Create())
      {
        var hashBytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(masterKey));
        _keyId = new Guid(hashBytes.Take(16).ToArray());
      }
    }

    public IReadOnlyCollection<XElement> GetAllElements()
    {
      // Use fixed dates so key never appears to expire
      var createdDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
      var expiresDate = new DateTime(2099, 12, 31, 23, 59, 59, DateTimeKind.Utc);

      var keyElement = new XElement(
        "key",
        new XAttribute("id", _keyId),
        new XAttribute("version", 1),
        new XAttribute(
          "created",
          XmlConvert.ToString(createdDate, XmlDateTimeSerializationMode.Utc)
        ),
        new XAttribute(
          "activated",
          XmlConvert.ToString(createdDate, XmlDateTimeSerializationMode.Utc)
        ),
        new XAttribute(
          "expires",
          XmlConvert.ToString(expiresDate, XmlDateTimeSerializationMode.Utc)
        ),
        new XElement(
          "descriptor",
          new XElement("encryption", new XAttribute("algorithm", "AES_256_CBC")),
          new XElement("validation", new XAttribute("algorithm", "HMACSHA256")),
          new XElement("masterKey", _masterKey)
        )
      );

      return new[] { keyElement };
    }

    public void StoreElement(XElement element, string friendlyName)
    {
      // Read-only: key is provided via constructor
    }
  }
}
