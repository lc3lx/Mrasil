import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { ordersApi } from '../api/ordersApi';
import { authApi } from '../api/authApi';
import { parcelsApi } from '../api/parcelsApi';
import { profileApi } from '../api/profileApi';
import { teamApi } from '../api/teamApi';
import { walletApi } from '../api/walletApi';
import { transicationApi } from '../api/transicationApi';
import { sallaApi } from '../api/sallaApi';
import { shipmentApi } from '../api/shipmentApi';
import { shipmentCompanyApi } from "../api/shipmentCompanyApi";
import { adressesApi } from "../api/adressesApi";
import { notificationsApi } from '../api/notificationsApi';

export const store = configureStore({
  reducer: {
    [ordersApi.reducerPath]: ordersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [parcelsApi.reducerPath]: parcelsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [transicationApi.reducerPath]: transicationApi.reducer,
    [sallaApi.reducerPath]: sallaApi.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
    [shipmentCompanyApi.reducerPath]: shipmentCompanyApi.reducer,
    [adressesApi.reducerPath]: adressesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ordersApi.middleware)
      .concat(authApi.middleware)
      .concat(parcelsApi.middleware)
      .concat(profileApi.middleware)
      .concat(teamApi.middleware)
      .concat(walletApi.middleware)
      .concat(transicationApi.middleware)
      .concat(sallaApi.middleware)
      .concat(shipmentApi.middleware)
      .concat(shipmentCompanyApi.middleware)
      .concat(adressesApi.middleware)
      .concat(notificationsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 