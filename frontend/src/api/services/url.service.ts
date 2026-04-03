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
