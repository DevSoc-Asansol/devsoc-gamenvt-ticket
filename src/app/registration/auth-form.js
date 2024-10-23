'use client'

import { useState, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Image from 'next/image'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { registerStudent } from '../actions/register-student'
import qr from "../../assets/qr-nayan.png"

export default function RegistrationForm() {
  const [state, formAction] = useFormState(registerStudent, null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Student Registration Form</h1>
      <form action={formAction} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" name="department" required />
        </div>

        <div>
          <Label>Year</Label>
          <RadioGroup name="year" required className="flex space-x-4">
            {['First', 'Second', 'Third', 'Fourth'].map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <RadioGroupItem value={year} id={`year-${year.toLowerCase()}`} />
                <Label htmlFor={`year-${year.toLowerCase()}`}>{year}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input id="whatsappNumber" name="whatsappNumber" required pattern="\d{10}" title="Please enter a 10-digit number" />
        </div>

        <div>
          <Label htmlFor="hasLaptop">Do you have a laptop?</Label>
          <Select name="hasLaptop" required>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="heardOfEngines">Have you heard of Unreal Engine/Unity?</Label>
          <Select name="heardOfEngines" required>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>QR Code</Label>
          <Image
          src={qr}
          alt="QR Code"
          width={200}
          height={200}
          />
        </div>

        <div>
          <Label htmlFor="paymentScreenshot">Upload Payment Screenshot</Label>
          <Input
            id="paymentScreenshot"
            name="paymentScreenshot"
            type="file"
            accept="image/*"
            required
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Payment Screenshot" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-gray-500">Click to upload image</span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="upiTransactionId">UPI Transaction ID</Label>
          <Input id="upiTransactionId" name="upiTransactionId" required />
        </div>

        <SubmitButton />

        {state?.message && (
          <div className={`mt-4 p-4 rounded ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {state.message}
          </div>
        )}
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  )
}