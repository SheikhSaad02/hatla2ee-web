import ProtectedRoute from '@/components/authentication/protected-route';

export default function MyGarageLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
