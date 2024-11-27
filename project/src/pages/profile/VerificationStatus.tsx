import { useAuth } from '@/hooks/useAuth';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export const VerificationStatus = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Verification Status</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your current identity verification status.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="flex items-center">
            {user?.isVerified ? (
              <>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <span className="ml-3 text-sm font-medium text-green-700">
                  Your identity has been verified
                </span>
              </>
            ) : (
              <>
                <XCircleIcon className="h-8 w-8 text-yellow-500" />
                <span className="ml-3 text-sm font-medium text-yellow-700">
                  Identity verification required
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};