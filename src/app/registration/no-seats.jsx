import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"

export default function NoSeatsAvailable() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Sorry, No More Seats Available
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <p className="text-gray-600 mb-4">
            We apologize, but all seats for this event have been filled. 
            The demand was higher than anticipated.
          </p>
          <p className="text-gray-600">
            Please check back later or join our waitlist to be notified 
            if any seats become available.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}