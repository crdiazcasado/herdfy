import { createNavigation } from 'next-intl/routing'
import { routing } from '@/i18n/routing'

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
