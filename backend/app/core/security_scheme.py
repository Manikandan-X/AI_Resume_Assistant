from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer


bearer_scheme = HTTPBearer(
    auto_error=True
)