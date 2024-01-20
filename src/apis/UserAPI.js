import { api } from "./configs/axiosConfig.js";
import { defineCancelApiObject } from "./configs/axiosUtils.js";

function objectToFormData(obj) {
	const formData = new FormData();
  
	Object.entries(obj).forEach(([key, value]) => {
		if (key === "roles" || key === "deleteFiles") {
			console.log(value)
			value = JSON.stringify(value)
			console.log(value)
		}
		formData.append(key, value);
	});
  
	return formData;
  }

export const UserAPI = {
	login: async function (username, password, cancel = false) {
		const response = await api.request({
			url: `/users/login`,
			method: "POST",
			data: { username, password },
			signal: cancel
				? cancelApiObject[this.login.name].handleRequestCancellation().signal
				: undefined,
		})

		return response.data.payload;
	},
	logout: async function (cancel = false) {
		const response = await api.request({
			url: `/users/logout`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.logout.name].handleRequestCancellation().signal
				: undefined,
		})

		return response.data.payload;
	},
	getSelf: async function (cancel = false) {
		const response = await api.request({
			url: `/users/self`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.getSelf.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload;
	},
	get: async function (user_id, cancel = false) {
		const response = await api.request({
			url: `/users/${user_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.get.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	getAll: async function (q = undefined, cancel = false) {
		const response = await api.request({
			url: "/users/",
			method: "GET",
			params: { q },
			signal: cancel
				? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
				: undefined,
		});
		return response.data.payload;
	},
	adminLab: async function (lab_id, cancel = false) {
		const response = await api.request({
			url: `/users/admin/${lab_id}`,
			method: "GET",
			signal: cancel
				? cancelApiObject[this.adminLabs.name].handleRequestCancellation().signal
				: undefined,
		})
		return response.data.payload
	}
};
const cancelApiObject = defineCancelApiObject(UserAPI);
