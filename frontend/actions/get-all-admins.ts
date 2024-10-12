'use server'

export async function getAllOrdersAsAdmin(token: any) {

    const response = await fetch(`http://127.0.0.1:8000/get-all-orders-as-admin/`, {
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