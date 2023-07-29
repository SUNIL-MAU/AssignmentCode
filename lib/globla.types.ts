export interface FormDataItem {
    id: number;
    name: string;
    age: number;
    dob: string;
    phoneNumber: number;
    address: { value: string }[];
    password: string;
    confirmPassword: string;
}