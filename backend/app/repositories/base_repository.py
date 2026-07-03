from typing import Generic
from typing import Type
from typing import TypeVar

from sqlalchemy.orm import Session

from app.db.database import Base


ModelType = TypeVar(
    "ModelType",
    bound=Base
)


class BaseRepository(Generic[ModelType]):

    def __init__(
        self,
        model: Type[ModelType]
    ):
        self.model = model

    def create(
        self,
        db: Session,
        obj: ModelType
    ) -> ModelType:

        db.add(obj)

        db.commit()

        db.refresh(obj)

        return obj

    def get_by_id(
        self,
        db: Session,
        obj_id: int
    ):

        return (
            db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )

    def get_all(
        self,
        db: Session
    ):

        return db.query(self.model).all()

    def delete(
        self,
        db: Session,
        obj: ModelType
    ):

        db.delete(obj)

        db.commit()
        
    def update(
        self,
        db: Session,
        obj: ModelType,
        data: dict
    ) -> ModelType:

        for key, value in data.items():
            setattr(obj, key, value)

        db.commit()

        db.refresh(obj)

        return obj
    
    