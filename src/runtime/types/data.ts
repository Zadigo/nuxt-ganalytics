export const enum Time {
  Second = 1000,
  Minute = 60 * 1000,
  Hour = 60 * 60 * 1000,
  Day = 24 * 60 * 60 * 1000
}

export const enum Setting {
  Expire = 365, // 1 Year
  SessionExpire = 1, // 1 Day
  CookieVersion = 2, // Increment this version every time there's a cookie schema change
  SessionTimeout = 30 * Time.Minute, // 30 minutes
  CookieInterval = 1, // 1 Day
  PingInterval = 1 * Time.Minute, // 1 Minute
  PingTimeout = 5 * Time.Minute, // 5 Minutes
  SummaryInterval = 100, // Same events within 100ms will be collapsed into single summary
  ClickText = 25, // Maximum number of characters to send as part of Click event's text field
  ClickClass = 50, // Maximum number of characters to send as part of Click event's class name
  ClickTag = 10, // Maximum number of characters to send as part of Click event's tag
  ClickId = 25, // Maximum number of characters to send as part of Click event's id
  PayloadLimit = 128, // Do not allow more than specified payloads per page
  PageLimit = 128, // Do not allow more than 128 pages in a session
  ShutdownLimit = 2 * Time.Hour, // Shutdown instrumentation after specified time
  RetryLimit = 1, // Maximum number of attempts to upload a payload before giving up
  PlaybackBytesLimit = 10 * 1024 * 1024, // 10MB
  CollectionLimit = 128, // Number of unique entries for dimensions
  ClickPrecision = 32767, // 2^15 - 1
  ClickParentTraversal = 10, // Maximum number of parent elements to traverse when computing relative click coordinates
  BoxPrecision = 100, // Up to 2 decimal points (e.g. 34.56)
  ScriptErrorLimit = 5, // Do not send the same script error more than 5 times per page
  DimensionLimit = 256, // Do not extract dimensions which are over 256 characters
  WordLength = 5, // Estimated average size of a word,
  RestartDelay = 250, // Wait for 250ms before starting to wire up again
  CallStackDepth = 20, // Maximum call stack depth before bailing out
  RatingScale = 100, // Scale rating to specified scale
  ViewportIntersectionRatio = 0.05, // Ratio of intersection area in comparison to viewport area before it's marked visible
  IntersectionRatio = 0.8, // Ratio of intersection area in comparison to element's area before it's marked visible
  MaxFirstPayloadBytes = 1 * 1024 * 1024, // 1MB: Cap the very first payload to a maximum of 1MB
  MegaByte = 1024 * 1024, // 1MB
  UploadFactor = 3, // Slow down sequence by specified factor
  MinUploadDelay = 100, // Minimum time before we are ready to flush events to the server
  MaxUploadDelay = 30 * Time.Second, // Do flush out payload once every 30s,
  ExtractLimit = 10000, // Do not extract more than 10000 characters
  ChecksumPrecision = 28, // n-bit integer to represent token hash
  UploadTimeout = 15000, // Timeout in ms for XHR requests
  LongTask = 30, // Long Task threshold in ms
  MaxBeaconPayloadBytes = 64 * 1024, // 64KB: Cap the beacon payload to a maximum of 64KB
}
