import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ordersApi } from "../api/ordersApi";
import { authApi } from "../api/authApi";
import { parcelsApi } from "../api/parcelsApi";
import { profileApi } from "../api/profileApi";
import { teamApi } from "../api/teamApi";
import { walletApi } from "../api/walletApi";
import { transicationApi } from "../api/transicationApi";
import { sallaApi } from "../api/sallaApi";
import { shipmentApi } from "../api/shipmentApi";
import { shipmentCompanyApi } from "../api/shipmentCompanyApi";
import { adressesApi } from "../api/adressesApi";
import { notificationsApi } from "../api/notificationsApi";
import { clientAdressApi } from "../api/clientAdressApi";
import { customerApi } from "../api/customerApi";
import { zedApi } from "../api/zedApi";
import { orderForClientAddressApi } from "../api/orderForClientAddressApi";
import { verifyEmailApi } from "../api/verifyEmailApi";
import { returnShipmentsApi } from "../api/returnShipmentsApi";
import { verifyOtpApi } from "../api/verifyOtpApi";
import { createReturnOrExchangeRequestApi } from "../api/createReturnOrExchangeRequestApi";
import { getReturnOrExchangeShipmentsApi } from "../api/getReturnOrExchangeShipmentsApi";
import { handleReturnApprovalApi } from "../api/handleReturnApprovalApi";
import { searchMyCustomerShipmentsApi } from "../api/searchMyCustomerShipmentsApi";
import { salaryApi } from "../api/salaryApi";
import { homePageApi } from "../api/homePageApi";
import { shopifyApi } from "../api/shopifyApi";
import { cityApi } from "../api/cityApi";
import { trackingApi } from "../api/trakingApi";

export const store = configureStore({
  reducer: {
    [trackingApi.reducerPath]: trackingApi.reducer,
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
    [clientAdressApi.reducerPath]: clientAdressApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [zedApi.reducerPath]: zedApi.reducer,
    [orderForClientAddressApi.reducerPath]: orderForClientAddressApi.reducer,
    [verifyEmailApi.reducerPath]: verifyEmailApi.reducer,
    [returnShipmentsApi.reducerPath]: returnShipmentsApi.reducer,
    [verifyOtpApi.reducerPath]: verifyOtpApi.reducer,
    [createReturnOrExchangeRequestApi.reducerPath]:
      createReturnOrExchangeRequestApi.reducer,
    [getReturnOrExchangeShipmentsApi.reducerPath]:
      getReturnOrExchangeShipmentsApi.reducer,
    [handleReturnApprovalApi.reducerPath]: handleReturnApprovalApi.reducer,
    [searchMyCustomerShipmentsApi.reducerPath]:
      searchMyCustomerShipmentsApi.reducer,
    [salaryApi.reducerPath]: salaryApi.reducer,
    [homePageApi.reducerPath]: homePageApi.reducer,
    [shopifyApi.reducerPath]: shopifyApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(trackingApi.middleware)
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
      .concat(notificationsApi.middleware)
      .concat(clientAdressApi.middleware)
      .concat(customerApi.middleware)
      .concat(zedApi.middleware)
      .concat(orderForClientAddressApi.middleware)
      .concat(verifyEmailApi.middleware)
      .concat(returnShipmentsApi.middleware)
      .concat(verifyOtpApi.middleware)
      .concat(createReturnOrExchangeRequestApi.middleware)
      .concat(getReturnOrExchangeShipmentsApi.middleware)
      .concat(handleReturnApprovalApi.middleware)
      .concat(searchMyCustomerShipmentsApi.middleware)
      .concat(salaryApi.middleware)
      .concat(homePageApi.middleware)
      .concat(shopifyApi.middleware)
      .concat(cityApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
