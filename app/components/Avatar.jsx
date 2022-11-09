import { Form, useSubmit } from '@remix-run/react';
import { useRef, useState } from 'react';
import altogic from '~/libs/altogic';

export default function Avatar({ user }) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const submit = useSubmit();
	const updateUserForm = useRef(null);
	const profilePictureInput = useRef(null);
	const [profilePicture] = useState(user?.profilePicture);

	const userPicture =
		user?.profilePicture ?? `https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`;

	async function handleChange(e) {
		const file = e.target.files[0];
		e.target.value = null;
		if (!file) return;
		try {
			setLoading(true);
			setErrorMessage(null);
			const { publicPath } = await updateProfilePicture(file);
			const user = await updateUser({ profilePicture: publicPath });
			profilePictureInput.current.value = user?.profilePicture;
			submit(updateUserForm.current);
		} catch (e) {
			setErrorMessage(e.message);
		} finally {
			setLoading(false);
		}
	}
	async function updateProfilePicture(file) {
		const { data, errors } = await altogic.storage.bucket('root').upload(file.name, file);
		if (errors) throw new Error("Couldn't upload file");
		return data;
	}
	async function updateUser(data) {
		const { data: userFromDB, errors } = await altogic.db.model('users').object(user?._id).update(data);
		if (errors) throw new Error("Couldn't update user");
		return userFromDB;
	}

	return (
		<div>
			<Form className="hidden" method="post" ref={updateUserForm} action="/api/update-user">
				<input ref={profilePictureInput} name="profilePicture" defaultValue={profilePicture} />
			</Form>
			<figure className="flex flex-col gap-4 items-center justify-center py-2">
				<picture className="border rounded-full w-24 h-24 overflow-hidden">
					<img className="object-cover w-full h-full" src={userPicture} alt={user?.name} />
				</picture>
			</figure>
			<div className="flex flex-col gap-4 justify-center items-center">
				<label className="border p-2 cursor-pointer">
					<span>{loading ? 'Uploading...' : 'Change Avatar'}</span>
					<input
						onChange={handleChange}
						name="picture"
						disabled={loading}
						className="hidden"
						type="file"
						accept="image/*"
					/>
				</label>
				{errorMessage && <p className="text-red-500">{errorMessage}</p>}
			</div>
		</div>
	);
}
