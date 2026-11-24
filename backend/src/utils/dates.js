const DONATION_INTERVAL_DAYS = 56;

export function getNextEligibleDate(
    lastDonation: string | null
): string | null {
    if (!lastDonation) {
        return null;
    }

    const datePart = lastDonation.slice(0, 10);

    const [year, month, day] = datePart
        .split("-")
        .map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    date.setUTCDate(
        date.getUTCDate() + DONATION_INTERVAL_DAYS
    );

    return date.toISOString().slice(0, 10);
}

export function getDaysSince(
    dateString: string | null
): number | null {
    if (!dateString) {
        return null;
    }

    const datePart = dateString.slice(0, 10);

    const [year, month, day] = datePart
        .split("-")
        .map(Number);

    const date = Date.UTC(year, month - 1, day);

    const today = new Date();

    const todayUTC = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    );

    return Math.floor(
        (todayUTC - date) / (1000 * 60 * 60 * 24)
    );
}
