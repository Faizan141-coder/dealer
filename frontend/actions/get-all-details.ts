'use server'

export async function getAllDetails(token: any) {

    const response = await fetch(`http://127.0.0.1:8000/get-all-details/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        try {
            return await response.json();
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    return null;
}