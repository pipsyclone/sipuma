import axios from "axios";
import useSWR from "swr";

const fetcher = async (url) => await axios.get(url).then((res) => res.data);

export function getUsers() {
	const { data, isLoading, error } = useSWR("/api/users/get-users", fetcher);
	return {
		users: data?.data || [],
		usersEmail: data?.email || [],
		usersLoading: isLoading,
		usersError: error,
	};
}
export function getUserDetail(userid) {
	const { data, isValidating, error } = useSWR(
		"/api/users/get-user-detail?userid=" + userid,
		fetcher
	);
	const isLoading = !data && isValidating;

	return {
		userDetail: data?.data,
		userUMKM: data?.dataUMKM,
		getuserDetailLoading: isLoading,
		error,
	};
}

export function getBusiness() {
	const { data, isValidating, error } = useSWR(
		"/api/bussines/get-bussines",
		fetcher
	);
	const isLoading = !data && isValidating;

	return {
		business: data?.data || [],
		verified: data?.dataVerified || [],
		notVerified: data?.dataNotVerified || [],
		waitVerified: data?.dataWaitVerified || [],
		getbusinessLoading: isLoading,
		bussinesError: error,
	};
}

export function getBusinessByUser(userid) {
	const { data, isLoading, error } = useSWR(
		"/api/bussines/get-bussines-by-user?userid=" + userid,
		fetcher
	);

	return {
		businessByUser: data?.data || null,
		getbusinessByUserLoading: isLoading,
		errorBussinesByUser: error,
	};
}

export function getProductByUmkmid(umkmid) {
	const { data, isLoading, error } = useSWR(
		"/api/products/get-product-by-umkmid?umkmid=" + umkmid,
		fetcher
	);

	return {
		productByUmkmid: data?.data,
	};
}

export function getCategorys() {
	const { data, isLoading, error } = useSWR(
		"/api/categorys/get-categorys",
		fetcher
	);

	return {
		categorys: data?.data,
		getCategorysLoading: isLoading,
		errorCategorys: error,
	};
}

export function getEvents(userid) {
	const { data, isLoading, error } = useSWR("/api/events/get-events", fetcher);

	return {
		events: data?.data || [],
		getEventsLoading: isLoading,
		errorEvents: error,
	};
}
