import { baseClient, tokenStorage } from '../baseClient'

export interface AuthUser {
	id: number
	email: string
	full_name?: string | null
}

export interface RegisterPayload {
	email: string
	password: string
	full_name: string
}

export interface LoginPayload {
	email: string
	password: string
}

export interface RefreshPayload {
	refreshToken: string
}

export interface AuthResponse {
	user: AuthUser
	accessToken: string
	refreshToken: string
}

export interface RefreshResponse {
	accessToken: string
	refreshToken: string
}

export interface CurrentUserResponse {
	user: AuthUser
}

const saveTokens = (accessToken: string, refreshToken: string): void => {
	tokenStorage.setTokens(accessToken, refreshToken)
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
	const { data } = await baseClient.post<AuthResponse>('/api/auth/register', payload)
	saveTokens(data.accessToken, data.refreshToken)
	return data
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
	const { data } = await baseClient.post<AuthResponse>('/api/auth/login', payload)
	saveTokens(data.accessToken, data.refreshToken)
	return data
}

export const refreshAuth = async (payload?: RefreshPayload): Promise<RefreshResponse> => {
	const refreshToken = payload?.refreshToken ?? tokenStorage.getRefreshToken()

	if (!refreshToken) {
		throw new Error('No refresh token available')
	}

	const { data } = await baseClient.post<RefreshResponse>('/api/auth/refresh', {
		refreshToken,
	})

	saveTokens(data.accessToken, data.refreshToken)
	return data
}

export const logout = async (): Promise<void> => {
	try {
		await baseClient.post('/api/auth/logout')
	} finally {
		tokenStorage.clearTokens()
	}
}

export const getCurrentUser = async (): Promise<AuthUser> => {
	const { data } = await baseClient.get<CurrentUserResponse>('/api/auth/me')
	return data.user
}