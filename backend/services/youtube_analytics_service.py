import os
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, Optional


class YouTubeAnalyticsService:
    """
    Interfaces with the YouTube Analytics API (v2) for authenticated channel analytics.
    Requires a valid OAuth 2.0 access_token with yt-analytics.readonly scope.
    Revenue metrics additionally require yt-analytics-monetary.readonly scope.
    """
    BASE_URL = "https://youtubeanalytics.googleapis.com/v2/reports"

    @classmethod
    def _is_valid_token(cls, access_token: Optional[str]) -> bool:
        return bool(access_token and access_token not in ("", "mock_access_token", "none"))

    @classmethod
    def _unavailable(cls, endpoint_desc: str, metrics: str = "", dimensions: str = "", requires_monetary: bool = False):
        scope = "yt-analytics-monetary.readonly" if requires_monetary else "yt-analytics.readonly"
        return {
            "unavailable": True,
            "reason": f"YouTube Analytics API requires OAuth authentication with scope '{scope}'. Connect your YouTube account in Settings to enable this metric.",
            "_meta": {
                "api": "YouTube Analytics API v2",
                "endpoint": endpoint_desc,
                "metrics": metrics,
                "dimensions": dimensions,
                "requires_oauth": True,
                "required_scope": scope,
            }
        }

    @classmethod
    def _make_request(cls, access_token: str, metrics: str, dimensions: str = "",
                      start_date: str = "", end_date: str = "", filters: str = "",
                      sort: str = "", max_results: int = 200) -> Dict[str, Any]:
        """Core request to YouTube Analytics API. Returns structured data with _meta."""
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "ids": "channel==MINE",
            "startDate": start_date,
            "endDate": end_date,
            "metrics": metrics,
            "maxResults": max_results,
        }
        if dimensions:
            params["dimensions"] = dimensions
        if filters:
            params["filters"] = filters
        if sort:
            params["sort"] = sort

        try:
            res = requests.get(cls.BASE_URL, headers=headers, params=params, timeout=15)
            if res.status_code != 200:
                return {
                    "unavailable": True,
                    "reason": f"YouTube Analytics API returned HTTP {res.status_code}: {res.text[:200]}",
                    "_meta": {"api": "YouTube Analytics API v2", "status_code": res.status_code}
                }

            data = res.json()
            columns = [col["name"] for col in data.get("columnHeaders", [])]
            rows = data.get("rows", [])

            parsed = [dict(zip(columns, row)) for row in rows]

            return {
                "data": parsed,
                "_meta": {
                    "api": "YouTube Analytics API v2",
                    "endpoint": cls.BASE_URL,
                    "metrics": metrics,
                    "dimensions": dimensions,
                    "row_count": len(parsed),
                    "quota_cost": 1,
                }
            }
        except requests.exceptions.RequestException as e:
            return {
                "unavailable": True,
                "reason": f"Network error communicating with YouTube Analytics API: {str(e)}",
                "_meta": {"api": "YouTube Analytics API v2", "error": str(e)}
            }

    # ── Overview ──
    @classmethod
    def get_overview(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?metrics=views,estimatedMinutesWatched,...", "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares")

        result = cls._make_request(access_token,
            metrics="views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares",
            start_date=start_date, end_date=end_date)

        if result.get("unavailable"):
            return result

        row = result["data"][0] if result["data"] else {}
        return {
            "data": {
                "views": row.get("views", 0),
                "watch_time_minutes": row.get("estimatedMinutesWatched", 0),
                "watch_time_hours": round(row.get("estimatedMinutesWatched", 0) / 60, 1),
                "avg_view_duration": row.get("averageViewDuration", 0),
                "subscribers_gained": row.get("subscribersGained", 0),
                "subscribers_lost": row.get("subscribersLost", 0),
                "likes": row.get("likes", 0),
                "comments": row.get("comments", 0),
                "shares": row.get("shares", 0),
            },
            "_meta": result["_meta"]
        }

    # ── Daily Metrics ──
    @classmethod
    def get_daily_metrics(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=day", "views,estimatedMinutesWatched,likes,comments,shares,subscribersGained", "day")

        result = cls._make_request(access_token,
            metrics="views,estimatedMinutesWatched,likes,comments,shares,subscribersGained",
            dimensions="day", start_date=start_date, end_date=end_date, sort="day")

        if result.get("unavailable"):
            return result

        return {"data": result["data"], "_meta": result["_meta"]}

    # ── Traffic Sources ──
    @classmethod
    def get_traffic_sources(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=insightTrafficSourceType", "views,estimatedMinutesWatched", "insightTrafficSourceType")

        result = cls._make_request(access_token,
            metrics="views,estimatedMinutesWatched",
            dimensions="insightTrafficSourceType",
            start_date=start_date, end_date=end_date, sort="-views")

        if result.get("unavailable"):
            return result

        formatted = [{"source": r.get("insightTrafficSourceType", "Unknown"), "views": r.get("views", 0), "watch_time": r.get("estimatedMinutesWatched", 0)} for r in result["data"]]
        return {"data": formatted, "_meta": result["_meta"]}

    # ── Demographics ──
    @classmethod
    def get_demographics(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=ageGroup,gender", "viewerPercentage", "ageGroup,gender")

        result = cls._make_request(access_token,
            metrics="viewerPercentage",
            dimensions="ageGroup,gender",
            start_date=start_date, end_date=end_date, sort="-viewerPercentage")

        if result.get("unavailable"):
            return result

        age_map = {}
        gender_map = {}
        for row in result["data"]:
            age = row.get("ageGroup", "Unknown")
            gender = row.get("gender", "Unknown")
            pct = row.get("viewerPercentage", 0)
            age_map[age] = age_map.get(age, 0) + pct
            gender_map[gender] = gender_map.get(gender, 0) + pct

        return {
            "data": {
                "age": [{"group": k, "percentage": round(v, 1)} for k, v in sorted(age_map.items())],
                "gender": [{"gender": k, "percentage": round(v, 1)} for k, v in gender_map.items()],
            },
            "_meta": result["_meta"]
        }

    # ── Geography ──
    @classmethod
    def get_geography(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=country", "views,estimatedMinutesWatched,subscribersGained", "country")

        result = cls._make_request(access_token,
            metrics="views,estimatedMinutesWatched,subscribersGained",
            dimensions="country",
            start_date=start_date, end_date=end_date, sort="-views", max_results=25)

        if result.get("unavailable"):
            return result

        formatted = [{"country": r.get("country", "??"), "views": r.get("views", 0), "watch_time": r.get("estimatedMinutesWatched", 0), "subs_gained": r.get("subscribersGained", 0)} for r in result["data"]]
        return {"data": formatted, "_meta": result["_meta"]}

    # ── Devices ──
    @classmethod
    def get_devices(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=deviceType", "views,estimatedMinutesWatched", "deviceType")

        result = cls._make_request(access_token,
            metrics="views,estimatedMinutesWatched",
            dimensions="deviceType",
            start_date=start_date, end_date=end_date, sort="-views")

        if result.get("unavailable"):
            return result

        formatted = [{"device": r.get("deviceType", "Unknown"), "views": r.get("views", 0), "watch_time": r.get("estimatedMinutesWatched", 0)} for r in result["data"]]
        return {"data": formatted, "_meta": result["_meta"]}

    # ── Revenue ──
    @classmethod
    def get_revenue(cls, access_token: str, start_date: str, end_date: str) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?metrics=estimatedRevenue,...", "estimatedRevenue,estimatedAdRevenue,grossRevenue,estimatedRedPartnerRevenue", requires_monetary=True)

        result = cls._make_request(access_token,
            metrics="estimatedRevenue,estimatedAdRevenue,grossRevenue,estimatedRedPartnerRevenue",
            start_date=start_date, end_date=end_date)

        if result.get("unavailable"):
            return result

        row = result["data"][0] if result["data"] else {}
        return {
            "data": {
                "estimated_revenue": row.get("estimatedRevenue", 0),
                "ad_revenue": row.get("estimatedAdRevenue", 0),
                "gross_revenue": row.get("grossRevenue", 0),
                "premium_revenue": row.get("estimatedRedPartnerRevenue", 0),
            },
            "_meta": result["_meta"]
        }

    @classmethod
    def get_top_videos(cls, access_token: str, start_date: str, end_date: str, max_results: int = 10) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=video", "views,estimatedMinutesWatched,estimatedRevenue,cpm", "video", requires_monetary=True)

        result = cls._make_request(access_token,
            metrics="views,estimatedMinutesWatched,estimatedRevenue,cpm",
            dimensions="video",
            start_date=start_date, end_date=end_date, sort="-estimatedRevenue", max_results=max_results)

        if result.get("unavailable"):
            return result

        return {"data": result["data"], "_meta": result["_meta"]}

    # ── Search Terms ──
    @classmethod
    def get_search_terms(cls, access_token: str, start_date: str, end_date: str, max_results: int = 25) -> Dict[str, Any]:
        if not cls._is_valid_token(access_token):
            return cls._unavailable("reports?dimensions=insightSearchTerm", "views", "insightSearchTerm")

        result = cls._make_request(access_token,
            metrics="views",
            dimensions="insightSearchTerm",
            start_date=start_date, end_date=end_date, sort="-views", max_results=max_results,
            filters="insightTrafficSourceType==YT_SEARCH")

        if result.get("unavailable"):
            return result

        formatted = [{"term": r.get("insightSearchTerm", ""), "views": r.get("views", 0)} for r in result["data"]]
        return {"data": formatted, "_meta": result["_meta"]}
