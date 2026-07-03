from app.models.job import Job
from app.repositories.base_repository import BaseRepository


class JobRepository(BaseRepository):

    def __init__(self):

        super().__init__(Job)