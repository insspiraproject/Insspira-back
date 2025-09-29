export enum ReportTarget {
    NONE = "none",
    PIN = "pin",
    USER ="user",
    COMMENT ="comment"
}

export enum ReportStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    RESOLVED = "resolved",
    DISMISSED = "dismissed"
}

export enum ReportType {
  SPAM = "spam",
  VIOLENCE = "violence",
  SEXUAL = "sexual",
  HATE = "hate",
  OTHER = "other",
}