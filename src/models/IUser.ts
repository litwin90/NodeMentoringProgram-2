export interface IUser {
    id: string;
    /**
     * @minLength 5
     * @maxLength 24
     * @pattern ^[\w.-]{0,19}[0-9a-zA-Z]$
     */
    login: string;
    /**
     * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$
     */
    password: string;
    /**
     * @minimum 4
     * @maximum 130
     */
    age: number;
    isDeleted: boolean;
}

export type UserToValidate = Omit<IUser, 'id' | 'isDeleted'>;
export type PartialUser = Partial<UserToValidate> & Partial<Pick<IUser, 'isDeleted'>>;
