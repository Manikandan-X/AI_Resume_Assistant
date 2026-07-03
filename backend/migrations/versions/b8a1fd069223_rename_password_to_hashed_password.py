"""rename password to hashed_password

Revision ID: b8a1fd069223
Revises: be23bb330de8
Create Date: 2026-06-30 17:14:24.427358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'b8a1fd069223'
down_revision: Union[str, Sequence[str], None] = 'be23bb330de8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "users",
        "password",
        new_column_name="hashed_password",
        existing_type=sa.String(length=255),
    )


def downgrade():
    op.alter_column(
        "users",
        "hashed_password",
        new_column_name="password",
        existing_type=sa.String(length=255),
    )
