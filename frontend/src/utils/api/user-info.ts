import {appApi, appMediaApi} from "@/utils/api/app-api";

export interface UserInfo {
    id: number
    password: string
    last_login: string
    is_superuser: boolean
    email: string
    first_name: string
    last_name: string
    is_active: boolean
    is_verified_email: boolean
    is_staff: boolean
    date_joined: string
    discord_username: any
    profile_picture: string
    groups: any[]
    user_permissions: any[]
}




export const getUserInfo = async () : Promise<UserInfo> => {
    const response = await appApi.get("users/profile/")
    return response.data
}



export const updateUserInfo = async (userData: { last_name: string; first_name: string }) => {
    const response = await appApi.patch(`users/profile/`, userData);
    return response.data;
}


export const deleteUserProfilePicture = async () => {
    const response = await appApi.delete(`users/update-profile-photo/`);
    return response.data;
}

export const updateUserProfilePicture = async (formData: FormData) => {
    const response = await appApi.patch(`users/update-profile-photo/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

