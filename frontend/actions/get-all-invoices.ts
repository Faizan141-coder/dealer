'use server'

export async function getAllInvoices(token: any) {

    const response = await fetch(`http://127.0.0.1:8000/get-all-invoices-from-dealer/`, {
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