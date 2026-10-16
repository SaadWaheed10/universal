export type RootTabParamList = {
  Downloads: undefined;
  Collections: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  MainTabs: undefined;
  AddDownload: { initialUrl?: string } | undefined;
  DownloadDetail: { id: string };
  CollectionDetail: { id: string };
};
