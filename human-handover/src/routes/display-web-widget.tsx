import { createFileRoute } from '@tanstack/react-router'
import { WebAvatarView } from '@/views/WebAvatarView.tsx'

export const Route = createFileRoute('/display-web-widget')({
  component: WebAvatarView,
})
