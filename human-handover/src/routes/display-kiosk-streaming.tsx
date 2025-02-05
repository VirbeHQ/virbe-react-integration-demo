import { createFileRoute } from '@tanstack/react-router';
import { KioskStreamView } from '@/views/KioskStreamView.tsx';

export const Route = createFileRoute('/display-kiosk-streaming')({
  component: KioskStreamView,
});
