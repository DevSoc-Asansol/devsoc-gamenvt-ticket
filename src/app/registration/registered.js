import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { EnvelopeOpenIcon } from "@radix-ui/react-icons"

export default function RegistrationConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Thanks for Registering</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Our admins are reviewing your registration.
          </p>
          <div className="flex justify-center">
            <EnvelopeOpenIcon className="h-16 w-16 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}