export function formatDonorId(id: number): string {
    return `DR-${String(id).padStart(6, "0")}`;
}

export function formatDonationId(id: number): string {
    return `DN-${String(id).padStart(6, "0")}`;
}
