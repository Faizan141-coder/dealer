'use server'

export async function getAllInvoicesFromSupplier(token: any) {

    const response = await fetch(`https://dealer-backend-kz82.vercel.app/get-all-confirmed-invoices-from-supplier/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return await response.json();
    }

    return null;
}