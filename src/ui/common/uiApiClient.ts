import axios from 'axios';
import { ApiClient } from 'shared/ApiClient';

const csrfEl = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfEl && csrfEl.getAttribute('content');

if (csrfToken == null) {
	throw new Error('csrf token not found!');
}

export const uiApiClient = new ApiClient(axios.create({
	headers: {
		'csrf-token': csrfToken
	}
}));