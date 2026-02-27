## Packages
framer-motion | For beautiful page transitions, card hovering, and button scaling (1.05x) as requested
canvas-confetti | For the receiver's success state celebration
@types/canvas-confetti | Types for canvas-confetti
react-hook-form | For robust form state management
@hookform/resolvers | For Zod integration with react-hook-form

## Notes
- App uses Replit Auth. The frontend calls `/api/login` instead of rendering a custom auth form.
- Relies on `@shared/routes` and `@shared/schema` for API contracts and types.
- Assumes `useAuth` hook is available at `@/hooks/use-auth`.
