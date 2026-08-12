from pydantic import BaseModel


class HashtagAnalytics(BaseModel):
    hashtag: str
    total_posts: int
    total_views: int
    average_engagement: float


class ReachPrediction(BaseModel):
    predicted_reach: int
    average_reach: float
    confidence: str


class AudienceForecast(BaseModel):
    current_followers: int
    predicted_followers: int
    expected_growth: int