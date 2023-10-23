from fastapi_discord import DiscordOAuthClient

from typing import Dict, List, Optional, Tuple, Union

import aiohttp
from aiocache import cached
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing_extensions import TypedDict, Literal
