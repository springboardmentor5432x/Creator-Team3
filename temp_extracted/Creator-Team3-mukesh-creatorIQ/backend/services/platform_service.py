class PlatformService:
    # Industry-standard configurable CPM rates (per 1,000 views)
    DEFAULT_CPM = {
        "YouTube": 4.50,
        "Instagram": 6.00,
        "TikTok": 3.50,
        "Facebook": 1.50,
        "X": 2.00,
        "LinkedIn": 12.00
    }

    @classmethod
    def get_cpm(cls, platform: str) -> float:
        return cls.DEFAULT_CPM.get(platform, 3.00)

    @classmethod
    def calculate_estimated_revenue(cls, platform: str, views: int) -> float:
        cpm = cls.get_cpm(platform)
        return (views / 1000.0) * cpm
