from app.models.creator_profile import CreatorProfile
from fastapi import HTTPException


def create_creator_profile(profile, db):

    existing_profile = db.query(CreatorProfile).filter(
        CreatorProfile.user_id == profile.user_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=409,
            detail="Creator profile already exists"
        )

    new_profile = CreatorProfile(
        user_id=profile.user_id,
        channel_name=profile.channel_name,
        bio=profile.bio,
        category=profile.category,
        country=profile.country,
        followers=profile.followers
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "message": "Creator Profile Created Successfully",
        "id": new_profile.id
    }


def get_creator_profiles(db):
    return db.query(CreatorProfile).all()