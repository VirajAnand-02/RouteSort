import { SignInForm } from "./signin-form"

type SearchParams = Record<string, string | string[] | undefined>

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const resolved = searchParams ? await searchParams : undefined
  const callbackUrl =
    typeof resolved?.callbackUrl === "string" ? resolved.callbackUrl : "/"
  const error = typeof resolved?.error === "string" ? resolved.error : undefined

  return <SignInForm callbackUrl={callbackUrl} error={error} />
}
