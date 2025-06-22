# Logging Best Practices

To maximize the effectiveness of your logging efforts and prevent excessive logging, it's crucial to follow well-established logging best practices. By implementing the following logging strategies, you'll ensure that your logs are both informative and manageable, leading to quicker issue resolution and lower costs!

*Source: [Logging Best Practices: 12 Dos and Don'ts by Ayooluwa Isaiah](https://betterstack.com/community/guides/logging/logging-best-practices/)*

## 1. Define Clear Objectives
The **purpose of logging** should always be **clear and aligned with your business or operational goals**. Logging is not just about generating lots of data; it’s about capturing the **right information** that helps you **track progress**, **diagnose problems**, and **make informed decisions**.

Before you start logging extensively, ask yourself:
1. What are the **key goals** of my application or system? (*e.g., uptime, error reduction, transaction accuracy*)
2. What are the **critical indicators (KPIs)** that define success for these goals? (*e.g., error rates, page load times, order completion rates*)

By defining objectives, you can decide exactly what events to log and avoid capturing excessive or irrelevant data that creates noise.

### Example
If your app processes **payments**, one objective might be: "**Ensure all transactions complete successfully.**" KPIs could include the **number of failed payments** or **average transaction processing time**. Your logs should then focus on **payment initiation**, **authorization**, **errors**, and **completion events** rather than unrelated background processes.




## 2. Use Appropriate Log Levels
Log levels help you communicate the **severity** or **importance** of logged events. Using them correctly allows you to **filter and focus on issues** that need your **immediate attention** versus routine, less critical events.

- **DEBUG**: Detailed information, typically of interest only when diagnosing problems.
- **INFO**: Confirmation that things are working as expected.
- **WARNING**: An indication that something unexpected happened, but the software is still functioning as expected.
- **ERROR**: An error occurred, and the software is not functioning as expected.
- **FATAL**: A serious error occurred, and the software may be unable to continue running.

By using log levels effectively, you can filter log messages based on their importance and focus on the most relevant information during troubleshooting.

Learn more: [Log Levels Explained and How to Use Them](https://betterstack.com/community/guides/logging/log-levels-explained/).

### ⚙️ Real-World Examples
#### 1. INFO
- Logging user account creation, successful payment processing, or API request completion.
- Example: "User john_doe successfully created an account at 10:30 AM."

#### 2. WARN
- Detect potential issues that don’t stop the system but deserve attention.
- Example: "Payment gateway response delayed by 5 seconds – retrying."

#### 3. ERROR
- When a single payment transaction fails but the overall service remains up.
- Example: "Payment transaction #12345 failed due to invalid credit card."

#### 4. FATAL
- When the application can't connect to the database and must shut down.
- Example: "Database connection failure on startup – shutting down the service."

#### 5. DEBUG & TRACE
- Detailed step-by-step flow during payment processing for diagnosing a problem.
- Example:
  - DEBUG: "Received payment request for $50 from user abc."
  - TRACE: "Calling third-party API for authorization."

## 3. Do Structured Logging
Historical logging practices were oriented toward creating logs that are readable by humans, often resulting in entries like these:

```plaintext
[2023-11-03 08:45:33,123] ERROR: Database connection failed: Timeout exceeded.
Nov  3 08:45:10 myserver kernel: USB device 3-2: new high-speed USB device number 4 using ehci_hcd
ERROR:  relation "custome" does not exist at character 15
```

These types of logs lack a uniform format that machines can parse efficiently, which can **hinder automated analysis** and **extend the time needed for diagnosing issues**.

Structured logging addresses this by using a consistent format, such as JSON, which allows for easier parsing and analysis. For example:

```json
{
  "timestamp": "2023-11-03T08:45:33.123Z",
  "level": "ERROR",
  "message": "Database connection failed",
  "details": {
    "error": "Timeout exceeded"
  }
}
```

With your logs in a structured format, it becomes significantly easier to set up custom parsing rules for monitoring, alerting, and visualization using log management tools like [Better Stack](https://betterstack.com/).

## 4. Write Meaningful Log Entries
Ensure that your log entries are **meaningful and descriptive**. Avoid vague messages like "Something went wrong" or "Error occurred." Instead, provide specific details about the event, including:
- The **context** of the event (e.g., which component or module is involved).
- The **exact nature of the issue** (e.g., "Database connection failed due to timeout").
- Any **relevant identifiers** (e.g., user ID, transaction ID) that can help trace the issue.
- Stack traces or error codes when applicable.

Here's an example of a log entry without sufficient context:

```json
{
  "timestamp": "2023-11-06T14:52:43.123Z",
  "level": "INFO",
  "message": "Login attempt failed"
}
```

Here's an example of a well-structured log entry:

```json
{
  "timestamp": "2023-11-06T14:52:43.123Z",
  "level": "INFO",
  "message": "Login attempt failed due to incorrect password",
  "user_id": "12345",
  "source_ip": "192.168.1.25",
  "attempt_num": 3,
  "request_id": "xyz-request-456",
  "service": "user-authentication",
  "device_info": "iPhone 12; iOS 16.1",
  "location": "New York, NY"
}
```

Do explore the Open Web Application Security Project’s (OWASP) compilation of [recommended event attributes](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#event-attributes) for additional insights into enriching your log entries.

Learn more: [Log Formatting Best Practices](https://betterstack.com/community/guides/logging/log-formatting/)

## 5. Do Sample Your Logs
For systems that **generate voluminous amounts of data**, reaching into hundreds of **gigabytes or terabytes per day**, log sampling is an invaluable **cost-control strategy** that involves **selectively capturing a subset of logs that are representative of the whole**, allowing the remainder to be safely omitted without affecting analysis needs.

A basic log sampling approach is capturing a **predetermined proportion of logs at set intervals**. For instance, with a sampling rate of **20%**, out of **10 occurrences** of an identical event within **one second**, only **two would be recorded,** and the rest discarded.

```go
func main() {
    log := zerolog.New(os.Stdout).
        With().
        Timestamp().
        Logger().
    Sample(&zerolog.BasicSampler{N: 5})

    for i := 1; i <= 10; i++ {
        log.Info().Msg("a log message: %d", i)
    }
}
```

## 6. Canonical Log Lines per Request
A canonical log line is a **single, comprehensive log entry** that is created at the end of each request to your service. This record is designed to be a **condensed summary** that **includes all the essential information about the request**, making it easier to understand what happened without needing to piece together information from multiple log entries.

This way, when you troubleshoot a failed request, **you only have a single log entry to look at**. This entry will have all the **necessary details**, including the request's **input parameters**, the **caller's identity** and **authentication method**, the **number of database queries** made, **timing** information, **rate limit** count, and any other data you see fit to add.

For example, a canonical log line might look like this:

```json
{
  "http_verb": "POST",
  "path": "/user/login",
  "source_ip": "203.0.113.45",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "request_id": "req_98765",
  "response_status": 500,
  "error_id": "ERR500",
  "error_message": "Internal Server Error",
  "oauth_application": "AuthApp_123",
  "oauth_scope": "read",
  "user_id": "user_789",
  "service_name": "AuthService",
  "git_revision": "7f8ff286cda761c340719191e218fb22f3d0a72",
  "request_duration_ms": 320,
  "database_time_ms": 120,
  "rate_limit_remaining": 99,
  "rate_limit_total": 100
}
```

This log entry provides a **comprehensive overview** of the request, making it easier to understand what happened without needing to sift through multiple log entries.

## 7. Aggregate and Centralize Logs
Centralizing your logs in a single location is crucial for effective monitoring and troubleshooting. By aggregating logs from different services, applications, and components, you can gain a holistic view of your system's behavior.
This approach allows you to correlate events across different parts of your system, making it easier to identify patterns and diagnose issues.
Use log management tools like [Better Stack](https://betterstack.com/) to aggregate and centralize your logs. These tools provide powerful search and filtering capabilities, enabling you to quickly find relevant log entries and gain insights into your system's performance.

Learn more: [What is Log Aggregation? Getting Started and Best Practices](https://betterstack.com/community/guides/logging/log-aggregation/)

## 8. Configure a Retention Policy
A log retention policy defines **how long logs are stored before they are deleted or archived**. This is essential for **managing storage costs** and ensuring **compliance with data protection regulations**.

Remember also to set up an appropriate [log rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) strategy to keep log file sizes in check on your application hosts.

## 9. Protect Logs with Access Control and Encryption
Certain logs, such as database logs, tend to contain some degree of **sensitive information**. Therefore, you must take steps to protect and secure the collected data to ensure that it **can only be accessed by personnel who genuinely need to use it** (such as for debugging problems). 

Implement **access control measures** to restrict who can view and modify logs. Use role-based access control (RBAC) to ensure that only authorized personnel can access sensitive log data. **Additionally**, consider **encrypting log files** both in transit and at rest to protect sensitive information from unauthorized access. Use industry-standard encryption protocols and keep your encryption keys secure.

## 10. Don't log overly sensitive information
Be cautious about logging sensitive information, such as passwords, credit card numbers, or personal identification numbers (PINs). If you must log such information for debugging purposes, ensure it is adequately protected (e.g., by using encryption) and that access is restricted to authorized personnel only.

## 11. Don't ignore the performance cost of logging
Logging can introduce performance overhead, especially if you log excessively or at a high frequency. To mitigate this, consider the following:
- **Use asynchronous logging**: This allows your application to continue processing requests while logs are written in the background, reducing the impact on performance.
- **Batch log writes**: Instead of writing logs one by one, batch them together to reduce the number of write operations.
- **Use log sampling**: As mentioned earlier, log sampling can help reduce the volume of logs generated while still capturing essential information.

## 12. Don't rely on logs for monitoring
While logs are valuable for troubleshooting and debugging, they **should not be your primary monitoring tool**. Instead, use **dedicated monitoring solutions that provide real-time insights** into your system's health and performance. These tools can help you set up **alerts**, **visualize metrics**, and **track key performance indicators (KPIs)** without relying solely on logs.

**Metrics**, on the other hand, excel in areas where logs fall short. They provide a continuous and efficient stream of data regarding various application behaviors and help define thresholds that necessitate intervention or further scrutiny.

They can help you answer questions like:
1. What is the **request rate** of my service?
2. What is the **error rate** of my service?
3. What is the **latency** of my service?

Metrics allow for the **tracking of these parameters over time**, presenting a dynamic and evolving picture of system behavior, health, and performance.

By leveraging both logs and metrics, you can create a comprehensive monitoring strategy that addresses the limitations of each approach while maximizing their strengths.

## Conclusion
By following these logging best practices, you can ensure that your logs are effective, manageable, and aligned with your business objectives. Remember to continuously review and refine your logging strategy as your application evolves and new requirements emerge. Effective logging is an ongoing process that requires attention and adaptation to changing needs.

## Additional Resources
- [Logging Best Practices](https://betterstack.com/community/guides/logging/logging-best-practices/)
- [Log Levels Explained and How to Use Them](https://betterstack.com/community/guides/logging/log-levels-explained/)
- [Log Formatting Best Practices](https://betterstack.com/community/guides/logging/log-formatting/)
- [What is Log Aggregation? Getting Started and Best Practices](https://betterstack.com/community/guides/logging/log-aggregation/)
- [What is Log Sampling?](https://betterstack.com/community/guides/logging/log-sampling/)
- [What is Log Rotation?](https://betterstack.com/community/guides/logging/what-is-log-rotation/)
- [What is Log Retention?](https://betterstack.com/community/guides/logging/what-is-log-retention/)
- [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)