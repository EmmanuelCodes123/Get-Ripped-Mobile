import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const navigate = (): NativeStackNavigationOptions => {
  return {
    animation: "slide_from_bottom",
  };
};
