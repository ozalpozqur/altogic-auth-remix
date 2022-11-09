import { useState } from 'react';
import { Form, Link } from '@remix-run/react';

export async function action({ request }) {
	const formData = await request.formData();
	return Object.fromEntries(formData);
}

export default function LoginWithMagicLink() {
	const [successMessage, setSuccessMessage] = useState('');
	const [error, setError] = useState('');
	return (
		<section className="flex flex-col items-center justify-center h-96 gap-4">
			<Form method="post" className="flex flex-col gap-2 w-full md:w-96">
				<h1 className="self-start text-3xl font-bold">Login with magic link</h1>
				<div className="bg-green-600 text-white text-[13px] p-2">{successMessage}</div>
				<div className="bg-red-600 text-white text-[13px] p-2">
					<p>{error.message}</p>
				</div>

				<input name="email" type="email" placeholder="Type your email" required />
				<div className="flex justify-between gap-4 items-start">
					<Link to="/register" className="text-indigo-600">
						Don't have an account? Register now
					</Link>
					<button
						type="submit"
						className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
					>
						Send magic link
					</button>
				</div>
			</Form>
		</section>
	);
}
