from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User, AgencyProfile
from Auth import get_current_user, check_role


router = APIRouter(
    prefix="/api/agency",
    tags=["Agency Profile"]
)



# -----------------------------
# Request Model
# -----------------------------

class AgencyCreate(BaseModel):
    agency_name: str
    company_name: str
    website: str
    industry: str
    location: str
    description: str



# -----------------------------
# Create Agency Profile
# -----------------------------

@router.post("/create")
def create_agency_profile(
    data: AgencyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    check_role(
        {
            "role": current_user.role
        },
        [
            "agency"
        ]
    )


    existing_profile = db.query(AgencyProfile).filter(
        AgencyProfile.user_id == current_user.id
    ).first()


    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Agency profile already exists"
        )


    profile = AgencyProfile(

        user_id=current_user.id,

        agency_name=data.agency_name,

        company_name=data.company_name,

        website=data.website,

        industry=data.industry,

        location=data.location,

        description=data.description
    )


    db.add(profile)
    db.commit()
    db.refresh(profile)


    return {
        "message": "Agency profile created successfully"
    }



# -----------------------------
# Get Agency Profile
# -----------------------------

@router.get("/")
def get_agency_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    check_role(
        {
            "role": current_user.role
        },
        [
            "agency"
        ]
    )


    profile = db.query(AgencyProfile).filter(
        AgencyProfile.user_id == current_user.id
    ).first()


    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Agency profile not found"
        )


    return profile



# -----------------------------
# Update Agency Profile
# -----------------------------

@router.put("/update")
def update_agency_profile(
    data: AgencyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    check_role(
        {
            "role": current_user.role
        },
        [
            "agency"
        ]
    )


    profile = db.query(AgencyProfile).filter(
        AgencyProfile.user_id == current_user.id
    ).first()


    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Agency profile not found"
        )


    profile.agency_name = data.agency_name
    profile.company_name = data.company_name
    profile.website = data.website
    profile.industry = data.industry
    profile.location = data.location
    profile.description = data.description


    db.commit()
    db.refresh(profile)


    return {
        "message": "Agency profile updated successfully"
    }



# -----------------------------
# Delete Agency Profile
# -----------------------------

@router.delete("/delete")
def delete_agency_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    check_role(
        {
            "role": current_user.role
        },
        [
            "agency"
        ]
    )


    profile = db.query(AgencyProfile).filter(
        AgencyProfile.user_id == current_user.id
    ).first()


    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Agency profile not found"
        )


    db.delete(profile)

    db.commit()


    return {
        "message": "Agency profile deleted successfully"
    }