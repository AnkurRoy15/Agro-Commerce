// src/navigation/types.ts
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Notifications: undefined;
  };
  
  export type MainTabParamList = {
    Home: undefined;
    Products: undefined;
    Cart: undefined;
    Profile: undefined;
  };
  
  export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }