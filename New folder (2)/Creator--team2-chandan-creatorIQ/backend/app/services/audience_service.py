from sqlalchemy.orm import Session

from app.models.audience import Audience
from app.models.user import User

from app.schemas.audience_schema import AudienceCreate
from fastapi import HTTPException


from sqlalchemy import asc, desc
def create_audience(
    db: Session,
    audience: AudienceCreate,
    current_user: User,
):

    new_audience = Audience(
        country=audience.country,
        age_group=audience.age_group,
        gender=audience.gender,
        followers=audience.followers,
        growth_rate=audience.growth_rate,
        creator_id=current_user.id,
    )

    db.add(new_audience)
    db.commit()
    db.refresh(new_audience)

    return new_audience


def get_all_audience(
    db: Session,
    current_user: User,
    country=None,
    gender=None,
    age_group=None,
    page=1,
    limit=10,
    sort_by="created_at",
    order="desc",
):
    query = db.query(Audience)

    if current_user.role == "creator":
        query = query.filter(
            Audience.creator_id == current_user.id
        )

    if country:
        query = query.filter(Audience.country == country)

    if gender:
        query = query.filter(Audience.gender == gender)

    if age_group:
        query = query.filter(Audience.age_group == age_group)

    allowed_sort_fields = {
        "followers": Audience.followers,
        "growth_rate": Audience.growth_rate,
        "created_at": Audience.created_at,
    }

    sort_column = allowed_sort_fields.get(
        sort_by,
        Audience.created_at,
    )

    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()

    audience = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": audience,
    }

def get_audience_analytics(
    db: Session,
    current_user: User,
):
    query = db.query(Audience)

    if current_user.role == "creator":
        query = query.filter(
            Audience.creator_id == current_user.id
        )

    audience = query.all()

    if not audience:
        return {
            "message": "No audience records found."
        }

    total_records = len(audience)
    total_followers = sum(a.followers or 0 for a in audience)

    average_followers = total_followers / total_records

    average_growth_rate = (
        sum(a.growth_rate or 0 for a in audience)
        / total_records
    )

    top_followers = max(
        audience,
        key=lambda x: x.followers
    )

    fastest_growth = max(
        audience,
        key=lambda x: x.growth_rate
    )

    country_distribution = {}
    gender_distribution = {}
    age_distribution = {}

    for item in audience:

        country_distribution[item.country] = (
            country_distribution.get(item.country, 0)
            + item.followers
        )

        gender_distribution[item.gender] = (
            gender_distribution.get(item.gender, 0)
            + item.followers
        )

        age_distribution[item.age_group] = (
            age_distribution.get(item.age_group, 0)
            + item.followers
        )

    return {
        "summary": {
            "total_records": total_records,
            "total_followers": total_followers,
            "average_followers": round(
                average_followers,
                2,
            ),
            "average_growth_rate": round(
                average_growth_rate,
                2,
            ),
        },

        "top_followers_segment": {
            "country": top_followers.country,
            "age_group": top_followers.age_group,
            "gender": top_followers.gender,
            "followers": top_followers.followers,
        },

        "fastest_growth_segment": {
            "country": fastest_growth.country,
            "growth_rate": fastest_growth.growth_rate,
        },

        "country_distribution": country_distribution,
        "gender_distribution": gender_distribution,
        "age_distribution": age_distribution,
    }

def get_audience_demographics(
    db: Session,
    current_user: User,
):

    query = db.query(Audience)

    if current_user.role == "creator":
        query = query.filter(
            Audience.creator_id == current_user.id
        )

    audience = query.all()

    return [
        {
            "country": person.country,
            "age_group": person.age_group,
            "gender": person.gender,
            "followers": person.followers,
            "growth_rate": person.growth_rate,
        }
        for person in audience
    ]

def get_audience_growth(
    db: Session,
    current_user: User,
):

    query = db.query(Audience)

    if current_user.role == "creator":
        query = query.filter(
            Audience.creator_id == current_user.id
        )

    audience = (
        query.order_by(Audience.created_at.asc())
        .all()
    )

    return [
        {
            "date": item.created_at.strftime("%Y-%m-%d"),
            "followers": item.followers,
            "growth_rate": item.growth_rate,
        }
        for item in audience
    ]




def update_audience(
    audience_id: int,
    audience_data,
    db: Session,
    current_user: User,
):
    audience = (
        db.query(Audience)
        .filter(Audience.id == audience_id)
        .first()
    )

    if not audience:
        raise HTTPException(
            status_code=404,
            detail="Audience record not found"
        )

    if (
        current_user.role == "creator"
        and audience.creator_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this audience"
        )

    update_data = audience_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(audience, key, value)

    db.commit()
    db.refresh(audience)

    return {
        "message": "Audience updated successfully",
        "audience": audience,
    }

def delete_audience(
    audience_id: int,
    db: Session,
    current_user: User,
):
    audience = (
        db.query(Audience)
        .filter(Audience.id == audience_id)
        .first()
    )

    if not audience:
        raise HTTPException(
            status_code=404,
            detail="Audience record not found"
        )

    if (
        current_user.role == "creator"
        and audience.creator_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this audience"
        )

    db.delete(audience)
    db.commit()

    return {
        "message": "Audience deleted successfully"
    }



def compare_audience(
    audience1: int,
    audience2: int,
    db: Session,
    current_user: User,
):
    query = db.query(Audience)

    if current_user.role == "creator":
        query = query.filter(
            Audience.creator_id == current_user.id
        )

    first = query.filter(
        Audience.id == audience1
    ).first()

    second = query.filter(
        Audience.id == audience2
    ).first()

    if not first or not second:
        raise HTTPException(
            status_code=404,
            detail="Audience record not found"
        )

    winner = (
        "Audience 1"
        if first.followers > second.followers
        else "Audience 2"
    )

    return {
        "audience_1": {
            "country": first.country,
            "followers": first.followers,
            "growth_rate": first.growth_rate,
        },

        "audience_2": {
            "country": second.country,
            "followers": second.followers,
            "growth_rate": second.growth_rate,
        },

        "comparison": {
            "winner": winner,
            "followers_difference": abs(
                first.followers - second.followers
            ),
            "growth_rate_difference": round(
                abs(
                    first.growth_rate
                    - second.growth_rate
                ),
                2,
            ),
        },
    }
