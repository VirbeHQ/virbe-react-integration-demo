import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-2">
      <Button onClick={() => void navigate({ to: '/display-web-widget' })}>Open Web Component (with avatar)</Button>
      <Button onClick={() => void navigate({ to: '/display-kiosk-streaming' })}>Open Render Stream</Button>
      <Button onClick={() => void navigate({ to: '/touch' })}>Open Avatarless (web component without avatar)</Button>
      <Button onClick={() => void navigate({ to: '/admin' })}>Open Admin panel</Button>
    </div>
  );
}
