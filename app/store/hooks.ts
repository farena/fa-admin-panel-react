import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Use in any component inside the store provider to call selectors defined in every slice
// useAppSelector(selectCounter) // selectCounter being a selector inside counter slide for example.
export const useAppSelector = useSelector.withTypes<RootState>();
