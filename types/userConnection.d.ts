import { UserProfileType } from "./userProfile";

export type UserConnectionType = {
    _id: string,
    email: string,
    password: string,
    token: string,
    profile: UserProfileType
    
};