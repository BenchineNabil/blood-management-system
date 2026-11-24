import {
    Request,
    Response,
    NextFunction
} from "express";

const bloodTypes = [
    "A+", "A-", "B+", "B-",
    "AB+", "AB-", "O+", "O-"
];

function validateCreateDonor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const data = req.body;
    const errors: string[] = [];

    if (
        typeof data.first_name !== "string" ||
        !data.first_name.trim()
    ) {
        errors.push("First name is required");
    }

    if (
        typeof data.last_name !== "string" ||
        !data.last_name.trim()
    ) {
        errors.push("Last name is required");
    }

    if (
        typeof data.date_of_birth !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date_of_birth)
    ) {
        errors.push(
            "Date of birth must use YYYY-MM-DD format"
        );
    }

    if (
        data.sex !== "M" &&
        data.sex !== "F"
    ) {
        errors.push("Sex must be M or F");
    }

    if (
        typeof data.address !== "string" ||
        !data.address.trim()
    ) {
        errors.push("Address is required");
    }

    if (
        typeof data.phone !== "string" ||
        !data.phone.trim()
    ) {
        errors.push("Phone is required");
    }

    if (
        data.blood_type !== undefined &&
        data.blood_type !== null &&
        !bloodTypes.includes(data.blood_type)
    ) {
        errors.push("Invalid blood type");
    }

    if (
        data.wants_reminder !== undefined &&
        typeof data.wants_reminder !== "boolean"
    ) {
        errors.push(
            "wants_reminder must be a boolean"
        );
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            errors
        });

        return;
    }

    next();
}

function validateUpdateDonor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const data = req.body;
    const errors: string[] = [];

    const allowedFields = [
        "first_name",
        "last_name",
        "date_of_birth",
        "sex",
        "address",
        "phone",
        "wants_reminder",
        "blood_type"
    ];

    const providedFields = Object.keys(data);

    if (providedFields.length === 0) {
        errors.push("At least one field is required");
    }

    for (const field of providedFields) {
        if (!allowedFields.includes(field)) {
            errors.push(`Invalid field: ${field}`);
        }
    }

    if (
        data.first_name !== undefined &&
        (
            typeof data.first_name !== "string" ||
            !data.first_name.trim()
        )
    ) {
        errors.push("Invalid first name");
    }

    if (
        data.last_name !== undefined &&
        (
            typeof data.last_name !== "string" ||
            !data.last_name.trim()
        )
    ) {
        errors.push("Invalid last name");
    }

    if (
        data.date_of_birth !== undefined &&
        (
            typeof data.date_of_birth !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data.date_of_birth)
        )
    ) {
        errors.push(
            "Date of birth must use YYYY-MM-DD format"
        );
    }

    if (
        data.sex !== undefined &&
        data.sex !== "M" &&
        data.sex !== "F"
    ) {
        errors.push("Sex must be M or F");
    }

    if (
        data.address !== undefined &&
        (
            typeof data.address !== "string" ||
            !data.address.trim()
        )
    ) {
        errors.push("Invalid address");
    }

    if (
        data.phone !== undefined &&
        (
            typeof data.phone !== "string" ||
            !data.phone.trim()
        )
    ) {
        errors.push("Invalid phone");
    }

    if (
        data.blood_type !== undefined &&
        data.blood_type !== null &&
        !bloodTypes.includes(data.blood_type)
    ) {
        errors.push("Invalid blood type");
    }

    if (
        data.wants_reminder !== undefined &&
        typeof data.wants_reminder !== "boolean"
    ) {
        errors.push(
            "wants_reminder must be a boolean"
        );
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            errors
        });

        return;
    }

    next();
}

export {
    validateCreateDonor,
    validateUpdateDonor
};
