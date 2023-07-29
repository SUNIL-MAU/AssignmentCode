import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormDataItem } from '@/lib/globla.types';

interface FormState {
    formDataArray: FormDataItem[];
}

const initialState: FormState = {
    formDataArray: [],
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateFormData: (state, action: PayloadAction<FormDataItem>) => {
            const { id } = action.payload;
            const existingFormDataIndex = state.formDataArray.findIndex((formData) => formData.id === id);

            if (existingFormDataIndex !== -1) {
                state.formDataArray[existingFormDataIndex] = action.payload;
            } else {
                state.formDataArray.push(action.payload);
            }
        },
        saveFormData: (state, action: PayloadAction<FormDataItem>) => {
            state.formDataArray.push(action.payload);
        },
        deleteFormData: (state, action: PayloadAction<number>) => {
            const idToDelete = action.payload;
            state.formDataArray = state.formDataArray.filter((formData) => formData.id !== idToDelete);
        },
    },
});

export const { saveFormData, updateFormData, deleteFormData } = formSlice.actions;
export default formSlice.reducer;
