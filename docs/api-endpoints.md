# Sprint 1 – API Endpoints

**Base URL:** `/api`

This document defines the API endpoints required for the Donors page, Eligibility Questionnaire popup, and Add Donation page.

## 1. Donors

| Method | Endpoint | Description |
|---|---|---|
| GET | `/donors` | Retrieve all donors for the donors page |
| GET | `/donors/:donorNumber` | Retrieve a donor's details |
| POST | `/donors` | Register a new donor |
| PUT | `/donors/:donorNumber` | Update donor information |
| GET | `/donors/:donorNumber/donations` | Retrieve a donor's donation history |

## 2. Eligibility Questionnaire

| Method | Endpoint | Description |
|---|---|---|
| GET | `/questionnaire` | Retrieve the questionnaire questions |
| POST | `/questionnaire/validate` | Submit questionnaire answers and receive an eligibility result |

**Notes:**
- The questionnaire will appear as a popup inside the Add Donor form.
- The eligibility rules must follow the hospital's official questionnaire and instructions.
- Do not invent or implement eligibility rules before receiving the official document.

## 3. Donations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/donations` | Retrieve all donations |
| GET | `/donations/:id` | Retrieve a donation's details |
| POST | `/donations` | Register a new donation |

**Notes:**
- Each donation produces exactly one blood bag.
- Every donation must be linked to an existing donor using the donor number.
- Donor information and donation information must remain separate.

## 4. Main Workflows

### Donor Registration

1. The frontend retrieves the questionnaire using `GET /questionnaire`.
2. The staff member fills in the donor information.
3. The questionnaire popup is displayed and completed.
4. The frontend submits the answers to `POST /questionnaire/validate`.
5. The backend returns the eligibility result.
6. The donor is registered using `POST /donors`.

### Donation Registration

1. The staff member opens the Add Donation page.
2. The staff member searches for and selects an existing donor.
3. The donation information is submitted using `POST /donations`.
4. The backend registers the donation and links it to the donor.

## 5. Important Implementation Decisions

- Questionnaire answers and their result should be stored with the corresponding donor registration, without creating duplicate questionnaire records.
- The questionnaire validation endpoint can calculate a preliminary eligibility result before registration.
- The final database design must support multiple donations per donor.
- A donor's donation history must be accessible through `/donors/:donorNumber/donations`.
- The `/donors/:donorNumber/donations` endpoint must be implemented only once, even though it is used by both the Donors and Donations features.

## 6. Endpoint Summary

| Feature | Number of endpoints |
|---|---:|
| Donors | 5 |
| Questionnaire | 2 |
| Donations | 3 |
| **Total** | **10** |

**Status:** Initial Sprint 1 API proposal. Request bodies, response formats, validation details, and database fields must be defined before implementation.
