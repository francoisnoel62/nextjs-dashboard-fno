'use client';

import { useActionState } from "react";
import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { authenticate, changePassword } from '@/app/lib/actions';

export default function LoginForm() {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loginError, loginAction] = useActionState(authenticate, undefined);
    const [passwordChangeError, passwordChangeAction] = useActionState(changePassword, undefined);
    
    const toggleForm = () => {
        setIsChangingPassword(!isChangingPassword);
    };

    return (
        <form action={isChangingPassword ? passwordChangeAction : loginAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    {isChangingPassword ? 'Change Password' : 'Please log in to continue.'}
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    
                    {isChangingPassword ? (
                        <>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="currentPassword"
                                >
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="currentPassword"
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Enter current password"
                                        required
                                        minLength={6}
                                    />
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="newPassword"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="newPassword"
                                        type="password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        required
                                        minLength={6}
                                    />
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="confirmNewPassword"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="confirmNewPassword"
                                        type="password"
                                        name="confirmNewPassword"
                                        placeholder="Confirm new password"
                                        required
                                        minLength={6}
                                    />
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mt-4">
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    minLength={6}
                                />
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-2">
                    <Button className="mt-4 w-full">
                        {isChangingPassword ? 'Change Password' : 'Log in'} 
                        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>
                    <Button
                        className="mt-2 w-full"
                        type="button"
                        onClick={toggleForm}
                    >
                        {isChangingPassword ? 'Back to Login' : 'Change Password'}
                        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>
                </div>

                <div className="flex h-8 items-end space-x-1">
                    {(isChangingPassword ? passwordChangeError : loginError) && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">
                                {isChangingPassword ? passwordChangeError : loginError}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}