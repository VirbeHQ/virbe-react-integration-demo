import { createFileRoute } from '@tanstack/react-router';
import { AvatarlessView } from '@/views/AvatarlessView.tsx';

export const Route = createFileRoute('/touch')({
  component: AvatarlessView,
});
