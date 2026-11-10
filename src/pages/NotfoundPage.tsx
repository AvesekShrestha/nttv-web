import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-8xl font-bold text-[#003b7a]">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Page not found
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 rounded-md bg-[#003b7a] px-6 py-2 text-sm font-medium text-white hover:bg-[#002d5c]"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
