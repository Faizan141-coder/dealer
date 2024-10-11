import { notFound } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type VerificationType = 'email' | 'phone'

export default function VerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const message = searchParams.message as string | undefined
  const type: VerificationType | null = getVerificationType(message)
  const isSuccess = isVerificationSuccessful(message)

  if (!type) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Verification
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {type.charAt(0).toUpperCase() + type.slice(1)} Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          ) : (
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          )}
          <p className="text-lg">
            {isSuccess
              ? `Your ${type} has been verified successfully.`
              : `There was an error verifying your ${type}.`}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <a href="/">Go to Login</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function getVerificationType(message: string | undefined): VerificationType | null {
  if (!message) {
    return null
  }
  
  if (message.toLowerCase().includes('email')) {
    return 'email'
  } else if (message.toLowerCase().includes('phone')) {
    return 'phone'
  }
  return null
}

function isVerificationSuccessful(message: string | undefined): boolean {
  return message ? message.toLowerCase().includes('successfully') : false
}