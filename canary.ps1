# Generate a 32-char hex CANARY
[System.Guid]::NewGuid().ToString("N").Substring(0, 32).ToUpper()
