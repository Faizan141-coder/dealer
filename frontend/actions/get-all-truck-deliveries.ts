'use server'

export async function getAllTruckDeliveries(token: any) {

    const response = await fetch(`https://dealer-backend-kz82.vercel.app/get-all-deliveries/`, {
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