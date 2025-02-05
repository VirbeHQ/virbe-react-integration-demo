import { createFileRoute } from '@tanstack/react-router';
import AdminScreen from '@/views/AdminScreen.tsx';

export const Route = createFileRoute('/admin')({
  component: AdminScreen,
});
