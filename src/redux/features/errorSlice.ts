import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface IError {
  isOpen: boolean,
  message: string,
}

const initialState: IError = {
    isOpen: false,
    message: ''
}

export const errorSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    toggleError: (state, action: PayloadAction<IError>) => {
        state.isOpen = action.payload.isOpen
        state.message = action.payload.message
    },

  },
})

export const { toggleError } = errorSlice.actions

export const selectError = (state: RootState) => state.error


export default errorSlice.reducer