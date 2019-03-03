import * as api from '../lib/serverApi/user';
import { createAsyncAction } from '../lib/reduxHelpers';

// pass in email and password
export const LOGIN_WITH_PASSWORD = 'LOGIN_WITH_PASSWORD';
export const loginWithPassword = createAsyncAction(LOGIN_WITH_PASSWORD, api.loginWithPassword);

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const changePassword = createAsyncAction(CHANGE_PASSWORD, api.changePassword);

export const RECOVER_PASSWORD = 'RECOVER_PASSWORD';
export const sendRecoverPasswordRequest = createAsyncAction(RECOVER_PASSWORD, api.resetPasswordRequest);

export const SIGNUP = 'SIGNUP';
export const signupUser = createAsyncAction(SIGNUP, api.signupUser);

export const RESEND_ACTIVATION_EMAIL = 'RESEND_ACTIVATION_EMAIL';
export const resendActivation = createAsyncAction(RESEND_ACTIVATION_EMAIL, api.resendActionationEmail);

export const LOGIN_WITH_COOKIE = 'LOGIN_WITH_COOKIE';
export const loginWithCookie = createAsyncAction(LOGIN_WITH_COOKIE, api.loginWithCookie);

export const RESET_PASSWORD = 'RESET_PASSWORD';
export const sendPasswordReset = createAsyncAction(RESET_PASSWORD, api.resetPassword, props => props);

export const RESET_API_KEY = 'RESET_API_KEY';
export const resetApiKey = createAsyncAction(RESET_API_KEY, api.resetApiKey);

export const REQUEST_DATA = 'REQUEST_DATA';
export const requestData = createAsyncAction(REQUEST_DATA, api.requestData);

export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const deleteAccount = createAsyncAction(DELETE_ACCOUNT, api.deleteAccount, email => email);
