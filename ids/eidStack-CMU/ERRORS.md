# Error Handling Policy

GlobalExceptionFilter returns consistent error payloads with correlation IDs.

Mapping:
- Validation errors -> 400
- Authentication -> 401
- Authorization -> 403
- Not Found -> 404
- Conflict -> 409
- Rate limit -> 429
- External -> 502
- Internal -> 500