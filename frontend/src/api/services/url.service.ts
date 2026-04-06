import { baseClient } from '../baseClient'

interface ShortenResponse {
	id: number
	user_id: number
	original_link: string
	short_link: string
	created_at: string
}

export const shortenUrl = async (originalLink: string): Promise<ShortenResponse> => {
	const { data } = await baseClient.post<ShortenResponse>('/api/urls', {
		original_link: originalLink,
	})
	return data
}

export const getUserLinks = async (): Promise<ShortenResponse[]> => {
	const { data } = await baseClient.get<ShortenResponse[]>('/api/urls', {
		withCredentials: true,
	})
	return data
}

export const deleteLink = async (id: number): Promise<void> => {
	await baseClient.delete(`/api/urls/${id}`, {
		withCredentials: true,
	})
}
